interface CategoryCardProps {
  title: string;
  emoji: string;
}

export default function CategoryCard({
  title,
  emoji,
}: CategoryCardProps) {
  return (
    <div className="cursor-pointer rounded-2xl border bg-white p-8 shadow transition duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="text-5xl">{emoji}</div>

      <h3 className="mt-4 text-xl font-bold">
        {title}
      </h3>
    </div>
  );
}