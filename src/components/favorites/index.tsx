import React from "react";
import { Link } from "react-router-dom";

export const Favorites = ({ favorites, removeFavorite }) => {
	return (
		<div className="favorites p-4">
			<h2 className="text-2xl font-bold mb-4">Favorite Movies</h2>

			{/* Кнопка для возврата на главную страницу поиска фильмов */}
			<div className="mb-4">
				<Link
					to="/"
					className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
				>
					Back to Search
				</Link>
			</div>

			{/* Отображение избранных фильмов */}
			{favorites.length > 0 ? (
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{favorites.map((movie) => (
						<div key={movie.id} className="movie-item text-center">
							{movie.poster_path ? (
								<img
									src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
									alt={movie.title}
									className="w-full h-auto rounded"
								/>
							) : (
								<div className="text-gray-500">No poster available</div>
							)}
							<h3 className="mt-2 text-lg">{movie.title}</h3>

							{/* Кнопка для удаления фильма из избранного */}
							<button
								className="mt-2 bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
								onClick={() => removeFavorite(movie.id)}
							>
								Remove from Favorites
							</button>
						</div>
					))}
				</div>
			) : (
				<p>No favorite movies added yet.</p>
			)}
		</div>
	);
};
