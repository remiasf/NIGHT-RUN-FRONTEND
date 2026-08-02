import CarViewer from "./CarViewer";

export interface CreateCarDto {
	brand: string;
	model: string;
	year: number;
	description: string;
	carType: "RALLY" | "CIVIL" | "TRACK" | "TOUGE";
	slug: string;
	price: number;
	originalPrice?: number | null;
	modelUrl?: string | null;
	imageUrl?: string | null;
	scale?: number | null;
	positionY?: number | null;
	rotationY?: number | null;
	environment?: string | null;
	engine?: string | null;
	engineType: string;
	engineCode?: string | null;
	hp?: number | null;
	torque?: number | null;
	displacement?: number | null;
	transmission?: string | null;
	driveType: string;
	zeroToHundred?: number | null;
	topSpeed?: number | null;
	weight?: number | null;
}

interface CarViewPageProps {
	car: CreateCarDto;
}

export const mockCarDto: CreateCarDto = {
	brand: "Nissan",
	model: "Skyline GT-R R34",
	year: 1999,
	description:
		"The Nissan Skyline GT-R R34 is the iconic fifth generation of the Japanese supercar, produced by Nissan from January 1999 to August 2002. The car became renowned for its phenomenal handling, racing victories, and technologies that were ahead of their time.",
	carType: "TRACK",
	slug: "nissan-skyline-gtr-r34-1999",
	price: 45000,
	originalPrice: 50000,
	modelUrl: "https://srnpiccxpucvujhdcgxw.supabase.co/storage/v1/object/public/car-models/2000_honda_civic_type_r_ek9.glb",
	scale: 1,
	positionY: 0,
	rotationY: 0,
	environment: "forest",
	engine: "Twin-Turbo Inline-6",
	engineType: "Inline-6",
	engineCode: "RB26DETT",
	hp: 280,
	torque: 353,
	displacement: 2.6,
	transmission: "Manual",
	driveType: "AWD",
	zeroToHundred: 5.4,
	topSpeed: 250,
	weight: 1540,
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

function formatNumber(value?: number | null, suffix = "") {
	if (value === null || value === undefined) {
		return "—";
	}

	return `${value}${suffix}`;
}

function StatItem({ label, value }: { label: string; value: string }) {
	return (
		<div className="w-full rounded-2xl border border-white/5 bg-zinc-900/70 p-4 sm:p-5">
			<p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
				{label}
			</p>
			<p className="mt-2 text-base font-semibold text-zinc-50">{value}</p>
		</div>
	);
}

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-b-0">
			<span className="text-sm text-zinc-500">{label}</span>
			<span className="text-sm font-medium text-zinc-100 text-right">{value}</span>
		</div>
	);
}

export default function CarViewPage({ car }: CarViewPageProps) {
	const modelPath = car.modelUrl ?? car.imageUrl ?? "";

	return (
		<section className="relative left-1/2 w-screen -translate-x-1/2 -mt-3 px-2 pt-0 pb-6 sm:-mt-5 sm:px-4 sm:pt-0 sm:pb-8 lg:-mt-7 lg:px-6 lg:pt-0 lg:pb-10">
			<div className="space-y-6">
				<div className="grid gap-6 xl:grid-cols-[1.75fr_1fr] xl:items-stretch">
					<div className="overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.12),_transparent_38%),linear-gradient(180deg,rgba(24,24,27,0.96),rgba(9,9,11,1))] shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
						<div className="h-[160px] sm:h-[520px] xl:h-full xl:min-h-[700px]">
							<CarViewer
								modelPath={modelPath}
								scale={car.scale ?? 1}
								fullHeight
							/>
						</div>
					</div>

					<div className="rounded-[2rem] border border-white/5 bg-zinc-950/90 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.4)] sm:p-6 lg:p-7 xl:p-8">
						<div className="flex flex-wrap items-start justify-between gap-4">
							<div>
								<p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-red-400">
									{car.carType}
								</p>
								<h1 className="mt-3 text-3xl font-black uppercase tracking-[0.12em] text-zinc-50 sm:text-4xl">
									{car.brand}
									<span className="block text-zinc-300">{car.model}</span>
								</h1>
							</div>

							<div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-right">
								<p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-300">
									Price
								</p>
								<p className="mt-1 text-2xl font-black text-white">
									{currencyFormatter.format(car.originalPrice ?? car.price)}
								</p>
							</div>
						</div>

						<div className="mt-5 flex flex-wrap gap-2">
							<span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300">
								{car.year}
							</span>
							<span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300">
								{car.driveType}
							</span>
							<span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300">
								{car.slug}
							</span>
						</div>

						<p className="mt-6 text-sm leading-7 text-zinc-400 sm:text-base">
							{car.description}
						</p>

						<div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
							<StatItem label="Horsepower" value={formatNumber(car.hp, " HP")} />
							<StatItem label="Torque" value={formatNumber(car.torque, " Nm")} />
							<StatItem label="0-100 km/h" value={formatNumber(car.zeroToHundred, " s")} />
							<StatItem label="Top speed" value={formatNumber(car.topSpeed, " km/h")} />
							<StatItem label="Weight" value={formatNumber(car.weight, " kg")} />
							<StatItem label="Displacement" value={formatNumber(car.displacement, " L")} />
						</div>
					</div>
				</div>

				<div className="rounded-[2rem] border border-white/5 bg-zinc-950/90 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.4)] sm:p-6 lg:p-8 xl:p-10">
					<div className="mt-8 rounded-[1.5rem] border border-white/5 bg-zinc-900/70 px-5 py-4">
						<div className="grid gap-0 sm:grid-cols-2 sm:gap-x-8">
							<InfoRow label="Engine" value={car.engine ?? "—"} />
							<InfoRow label="Engine type" value={car.engineType} />
							<InfoRow label="Engine code" value={car.engineCode ?? "—"} />
							<InfoRow label="Transmission" value={car.transmission ?? "—"} />
							<InfoRow label="Environment" value={car.environment ?? "—"} />
							<InfoRow label="Model scale" value={formatNumber(car.scale)} />
							<InfoRow label="Position Y" value={formatNumber(car.positionY)} />
							<InfoRow label="Rotation Y" value={formatNumber(car.rotationY)} />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
