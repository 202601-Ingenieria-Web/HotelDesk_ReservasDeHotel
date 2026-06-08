interface RoomProps {
  title: string;
  price: number;
  image: string;
  available: boolean;
}

export function RoomCard({ title, price, image, available }: RoomProps) {
  return (
    <div className="bg-warm-card rounded-2xl border border-warm-border overflow-hidden shadow-sm hover:shadow-md transition-all group">
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {available ? 'Disponible' : 'Ocupada'}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-warm-text mb-1">{title}</h3>
        <p className="text-warm-muted text-sm mb-4">Suite de lujo con servicios premium incluidos.</p>
        
        <div className="flex items-center justify-between mt-auto">
          <p className="text-primary font-bold text-xl">${price}<span className="text-warm-muted text-xs font-normal"> /noche</span></p>
          <button className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors">
            Reservar
          </button>
        </div>
      </div>
    </div>
  );
}