export default function ResultCard({ prediction }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-10 mt-8 text-center">
      <h3 className="text-xl text-gray-500 mb-2">
        Precio estimado
      </h3>
      <p className="text-5xl font-display font-bold text-primary">
        {prediction.precio_estimado.toLocaleString()} €
      </p>
      <p className="mt-4 text-gray-600">
        {prediction.mensaje}
      </p>
    </div>
  )
}
