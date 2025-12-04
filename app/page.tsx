import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data: articles } = await supabase.from("todos").select();

  return (
    <ul>
      {articles?.map((article) => (
        <li key={article.id}>{article.title}</li>
      ))}
    </ul>
  );
}
