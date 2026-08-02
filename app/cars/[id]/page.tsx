import { AxiosError } from "axios";
import { notFound } from "next/navigation";
import axiosInstance from "../../../lib/axios";
import CarViewPage, { CreateCarDto } from "../../components/car-view-page";

interface ApiCarDetails {
	id?: string | number;
	brand?: string;
	model?: string;
	year?: number;
	description?: string;
	carType?: "RALLY" | "CIVIL" | "TRACK" | "TOUGE";
	slug?: string;
	price?: number;
	originalPrice?: number | null;
	modelUrl?: string | null;
	imageUrl?: string | null;
	scale?: number | null;
	positionY?: number | null;
	rotationY?: number | null;
	environment?: string | null;
	engine?: string | null;
	engineType?: string;
	engineCode?: string | null;
	hp?: number | null;
	torque?: number | null;
	displacement?: number | null;
	transmission?: string | null;
	driveType?: string;
	zeroToHundred?: number | null;
	topSpeed?: number | null;
	weight?: number | null;
}

function toCreateCarDto(id: string, car: ApiCarDetails): CreateCarDto {
	return {
		brand: car.brand ?? "Unknown brand",
		model: car.model ?? "Unknown model",
		year: car.year ?? 0,
		description: car.description ?? "No description available.",
		carType: car.carType ?? "CIVIL",
		slug: car.slug ?? id,
		price: car.price ?? 0,
		originalPrice: car.originalPrice ?? null,
		modelUrl: car.modelUrl ?? null,
		imageUrl: car.imageUrl ?? null,
		scale: car.scale ?? null,
		positionY: car.positionY ?? null,
		rotationY: car.rotationY ?? null,
		environment: car.environment ?? null,
		engine: car.engine ?? null,
		engineType: car.engineType ?? "Unknown",
		engineCode: car.engineCode ?? null,
		hp: car.hp ?? null,
		torque: car.torque ?? null,
		displacement: car.displacement ?? null,
		transmission: car.transmission ?? null,
		driveType: car.driveType ?? "Unknown",
		zeroToHundred: car.zeroToHundred ?? null,
		topSpeed: car.topSpeed ?? null,
		weight: car.weight ?? null,
	};
}

export default async function CarDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	try {
		let response;

		try {
			response = await axiosInstance.get<ApiCarDetails>(`/car/${encodeURIComponent(id)}`);
		} catch (error) {
			if (!(error instanceof AxiosError) || error.response?.status !== 404) {
				throw error;
			}

			response = await axiosInstance.get<ApiCarDetails>(`/cars/${encodeURIComponent(id)}`);
		}

		if (!response.data) {
			notFound();
		}

		return <CarViewPage car={toCreateCarDto(id, response.data)} />;
	} catch (error) {
		if (error instanceof AxiosError && error.response?.status === 404) {
			notFound();
		}

		return (
			<section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
				<p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
					Could not load this car right now. Please try again.
				</p>
			</section>
		);
	}
}
