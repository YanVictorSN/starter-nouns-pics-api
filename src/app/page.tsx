"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

export default function Home() {
  const [nounPics, setNounPics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const batchSize = 100;

  const fetchNounPics = useCallback(async (start: any, end: any) => {
    try {
      const response = await fetch(
        `https://noun.pics/range?start=${start}&end=${end}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNounPics((prevPics) => {
        const existingIds = new Set(prevPics.map((pic: any) => pic.id));
        const newPics = data.filter((pic: any) => !existingIds.has(pic.id));
        return [...prevPics, ...newPics];
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loading) return;
    setLoading(true);
    fetchNounPics(page * batchSize, (page + 1) * batchSize - 1);
  }, [page, fetchNounPics]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-8 text-center w-full">
        Nouns Pictures
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
        {nounPics.map((pic: any, index: number) => (
          <div
            key={pic.id || index}
            className="border border-gray-300 p-2 rounded-lg flex flex-col items-center bg-white shadow-md"
          >
            <Image
              src={pic.svg}
              alt={`Noun ${pic.id || index}`}
              width={200}
              height={200}
              className="max-w-full max-h-32 object-contain"
            />
            <p className="mt-2 text-gray-700 font-medium">
              Noun: {pic.id || "0"}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={loadMore}
        disabled={loading}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
      >
        {loading ? "Loading..." : "Load More"}
      </button>
    </main>
  );
}
