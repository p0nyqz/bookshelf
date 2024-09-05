import React, { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { GetPoster } from "./components/get-poster";
import { SearchMovies } from "./components/search-movie";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Favorites } from "./components/favorites";

function App() {
	// const [count, setCount] = useState(0);
	const [favorites, setFavorites] = useState([]); // Состояние для хранения избранных фильмов

	// Загружаем избранные фильмы из localStorage при первой загрузке
	useEffect(() => {
		const savedFavorites = localStorage.getItem("favorites");
		if (savedFavorites) {
			console.log(
				"Loaded favorites from localStorage:",
				JSON.parse(savedFavorites),
			);
			setFavorites(JSON.parse(savedFavorites));
		}
	}, []);

	// Сохранение избранных фильмов в localStorage при каждом обновлении favorites
	useEffect(() => {
		if (favorites.length > 0) {
			// Сохраняем только если есть элементы
			console.log("Saving favorites to localStorage:", favorites);
			localStorage.setItem("favorites", JSON.stringify(favorites));
		}
	}, [favorites]);

	// Функция для добавления фильма в избранное
	const addFavorite = (movie) => {
		if (!favorites.some((fav) => fav.id === movie.id)) {
			const updatedFavorites = [...favorites, movie];
			setFavorites(updatedFavorites);
		}
	};

	// Функция для удаления фильма из избранного
	const removeFavorite = (movieId) => {
		const updatedFavorites = favorites.filter((movie) => movie.id !== movieId);
		setFavorites(updatedFavorites);
	};

	return (
		<Router>
			<div className="App">
				<header className="bg-gray-800 text-white p-5 text-center">
					<h1 className="text-4xl font-bold">Movie Search App</h1>
				</header>

				<main className="p-4">
					<Routes>
						<Route
							path="/"
							element={<SearchMovies addFavorite={addFavorite} />}
						/>
						<Route
							path="/favorites"
							element={
								<Favorites
									favorites={favorites}
									removeFavorite={removeFavorite}
								/>
							}
						/>
					</Routes>
				</main>
			</div>
		</Router>
	);
}

export default App;
