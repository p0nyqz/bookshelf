// import { Text } from "gluestack-ui";
import { useState, useEffect } from "react";
import axios from "axios";
import "../../App.css";

// API ключ из TMDB (замените на ваш реальный ключ)
const API_KEY = import.meta.env.TMDB_API_KEY;

// ID фильма для получения данных (замените на нужный ID)
const MOVIE_ID = 550; // Например, ID фильма Fight Club

export const GetPoster = () => {
	const [posterUrl, setPosterUrl] = useState<string | null>(null);

	useEffect(() => {
		const fetchPoster = async () => {
			try {
				// Запрос к TMDB API для получения информации о фильме
				const response = await axios.get(
					`https://api.themoviedb.org/3/movie/${MOVIE_ID}`,
					{
						params: {
							api_key: API_KEY,
						},
					},
				);

				// Извлекаем путь к постеру из ответа
				const posterPath = response.data.poster_path;
				if (posterPath) {
					// Формируем полный URL для постера
					const fullPosterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;
					setPosterUrl(fullPosterUrl);
				}
			} catch (error) {
				console.error("Error fetching movie data:", error);
			}
		};

		fetchPoster();
	}, []);

	// Если постер загружен, отображаем его, иначе показываем заглушку
	return (
		<div>
			{posterUrl ? (
				<img
					className="rounded-3xl border-8 border-blue-200"
					src={posterUrl}
					alt="Movie Poster"
				/>
			) : (
				<p>Loading poster...</p>
			)}
		</div>
	);
};
