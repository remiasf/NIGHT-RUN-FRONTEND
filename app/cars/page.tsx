"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import api from "../../lib/axios";
import CarCard from "../components/CarCard";

interface ApiCar {
	id?: string | number;
	brand: string;
	model: string;
	year: number;
	hp?: number | null;
	torque?: number | null;
	displacement?: number | null;
	weight?: number | null;
	topSpeed?: number | null;
	modelUrl?: string | null;
}

interface CarsMeta {
	totalPages: number;
	total: number;
	page: number;
	limit: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

interface CarsResponse {
	data: ApiCar[];
	meta: CarsMeta;
}

const CAR_TYPES = ["RALLY", "TRACK", "CIVIL", "TOUGE"] as const;
type CarType = (typeof CAR_TYPES)[number];

function toCarType(value: string | null): CarType | undefined {
	if (!value) {
		return undefined;
	}

	const normalized = value.trim().toUpperCase();
	return CAR_TYPES.includes(normalized as CarType) ? (normalized as CarType) : undefined;
}

function toCardCar(car: ApiCar) {
	return {
        id: car.id,
		brand: car.brand,
		model: car.model,
		year: car.year,
		hp: car.hp ?? 0,
		torque: car.torque ?? 0,
		displacement: car.displacement ?? 0,
		weight: car.weight ?? 0,
		topSpeed: car.topSpeed ?? 0,
		modelUrl: car.modelUrl ?? "",
	};
}

export default function CarsPage() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const currentSearch = useMemo(
		() => searchParams.get("search")?.trim() ?? "",
		[searchParams],
	);

	const currentCarType = useMemo(() => toCarType(searchParams.get("carType")), [searchParams]);

	const [searchInput, setSearchInput] = useState(currentSearch);
	const [cars, setCars] = useState<ApiCar[]>([]);
	const [meta, setMeta] = useState<CarsMeta | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const currentPage = useMemo(() => {
		const pageParam = Number(searchParams.get("page"));
		return Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
	}, [searchParams]);

	useEffect(() => {
		setSearchInput(currentSearch);
	}, [currentSearch]);

	useEffect(() => {
		let isMounted = true;

		async function fetchCars() {
			setIsLoading(true);
			setErrorMessage("");

			try {
				const response = await api.get<CarsResponse | ApiCar[]>("/car", {
					params: {
						search: currentSearch || undefined,
						carType: currentCarType,
						page: currentPage,
					},
				});

				if (!isMounted) {
					return;
				}

				const payload = response.data;

				if (Array.isArray(payload)) {
					setCars(payload);
					setMeta(null);
					return;
				}

				setCars(payload.data ?? []);
				setMeta(payload.meta ?? null);
			} catch {
				if (!isMounted) {
					return;
				}

				setCars([]);
				setMeta(null);
				setErrorMessage("Could not load cars. Please try again.");
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		}

		fetchCars();

		return () => {
			isMounted = false;
		};
	}, [currentCarType, currentPage, currentSearch]);

	function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const nextSearch = searchInput.trim();
		const nextParams = new URLSearchParams(searchParams.toString());
		nextParams.delete("page");

		if (!nextSearch) {
			nextParams.delete("search");
			const target = nextParams.toString();
			router.replace(target ? `${pathname}?${target}` : pathname);
			return;
		}

		nextParams.set("search", nextSearch);
		router.replace(`${pathname}?${nextParams.toString()}`);
	}

	function goToPage(page: number) {
		if (page < 1 || (meta && page > meta.totalPages)) {
			return;
		}

		const nextParams = new URLSearchParams(searchParams.toString());
		nextParams.set("page", String(page));
		router.replace(`${pathname}?${nextParams.toString()}`);
	}

	const paginationPages = useMemo(() => {
		if (!meta || meta.totalPages <= 1) {
			return [] as number[];
		}

		const start = Math.max(1, meta.page - 2);
		const end = Math.min(meta.totalPages, start + 4);
		const adjustedStart = Math.max(1, end - 4);

		return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index);
	}, [meta]);

	return (
		<section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
			<form onSubmit={handleSearchSubmit} className="flex w-full gap-3">
				<input
					type="search"
					value={searchInput}
					onChange={(event) => setSearchInput(event.target.value)}
					placeholder="Search by brand, model, description..."
					className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-red-500/60"
				/>
				<button
					type="submit"
					className="h-12 shrink-0 rounded-xl border border-red-600/40 bg-red-700/90 px-5 text-sm font-semibold text-white transition hover:bg-red-600"
				>
					Search
				</button>
			</form>

			{meta && meta.totalPages > 1 ? (
				<div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
					<p className="text-sm text-zinc-400">
						Page {meta.page} of {meta.totalPages} • {meta.total} cars
					</p>

					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => goToPage(meta.page - 1)}
							disabled={!meta.hasPreviousPage}
							className="h-9 rounded-lg border border-zinc-700 px-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
						>
							Previous
						</button>

						{paginationPages.map((pageNumber) => {
							const isActive = pageNumber === meta.page;

							return (
								<button
									key={pageNumber}
									type="button"
									onClick={() => goToPage(pageNumber)}
									className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-semibold transition ${
										isActive
											? "border-red-500/60 bg-red-500/20 text-red-100"
											: "border-zinc-700 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800"
									}`}
								>
									{pageNumber}
								</button>
							);
						})}

						<button
							type="button"
							onClick={() => goToPage(meta.page + 1)}
							disabled={!meta.hasNextPage}
							className="h-9 rounded-lg border border-zinc-700 px-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
						>
							Next
						</button>
					</div>
				</div>
			) : null}

			{isLoading ? <p className="text-zinc-400">Loading cars...</p> : null}
			{errorMessage ? <p className="text-red-400">{errorMessage}</p> : null}

			{!isLoading && !errorMessage && cars.length === 0 ? (
				<p className="text-zinc-400">No cars found.</p>
			) : null}

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
				{cars.map((car, index) => (
					<Link
						key={car.id ? String(car.id) : `${car.brand}-${car.model}-${car.year}-${index}`}
						href={car.id ? `/cars/${encodeURIComponent(String(car.id))}` : "/cars"}
						className="block"
					>
						<CarCard car={toCardCar(car)} />
					</Link>
				))}
			</div>

		</section>
	);
}
