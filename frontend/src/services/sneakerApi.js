// src/services/sneakerApi.js

const fetchSneakerImages = async () => {
  const response = await fetch(
    "https://api.unsplash.com/search/photos?query=sneakers&per_page=12",
    {
      headers: {
        Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_KEY}`,
      },
    }
  );

  const data = await response.json();

  return data.results.map((item) => ({
    image: item.urls.small,
  }));
};

export default fetchSneakerImages;
