import axios from "axios";
import { supabase } from "utils/supabase";

const handler = async (req, res) => {
  try {
    const {
      record: { id, content },
    } = req.body;
    const { secret } = req.headers;

    if (!id || !content || secret !== process.env.SECRET) {
      return res.status(400).send("please include proper id, query and secret");
    }

    const todayDate = new Date();
    const yesterdayDate = new Date();
    const dayBeforeDate = new Date();
    yesterdayDate.setDate(todayDate.getDate() - 1);
    dayBeforeDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split("T")[0];
    const dayBefore = dayBeforeDate.toISOString().split("T")[0];

    const headers = {
      Authorization: `Bearer ${process.env.TWITTER_TOKEN}`,
    };

    const baseUrl = "https://api.twitter.com/1.1/search/tweets.json";
    const url = `${baseUrl}?q=${content} until%3A${yesterday} since%3A${dayBefore} -filter:retweets -filter%3Areplies&count=100&include_entities=false&tweet_mode=extended`;

    const { data } = await axios.get(url, { headers });

    const tweets = data.statuses.map(
      ({ id_str, full_text, created_at, user: { screen_name } }) => ({
        tweet_created_at: created_at,
        tweet_id: id_str,
        content: full_text,
        tweet_url: `https://twitter.com/${screen_name}/status/${id_str}`,
        handle: screen_name,
        query_id: Number(id),
      })
    );

    const { error } = await supabase.from("tweet").insert(tweets);

    await supabase.rpc("get_tweets_each_day", {
      id,
      content,
    });

    res.send({
      tweets,
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

export default handler;
