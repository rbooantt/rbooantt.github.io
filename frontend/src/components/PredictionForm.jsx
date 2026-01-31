import { useState, useEffect } from "react";
import axios from "axios";

const distritoZonas = {
  'Arganzuela': ['Acacias', 'Chopera', 'Delicias', 'Imperial', 'Legazpi', 'Palos de Moguer', 'Atocha'],
  'Barajas': ['Aeropuerto', 'Alameda de Osuna', 'Casco Historico de Barajas', 'Corralejos', 'Timon'],
  'Carabanchel': ['Abrantes', 'Comillas', 'Opanel', 'San Isidro', 'Vista Alegre', 'Puerta Bonita', 'Buenavista', 'Pau de Carabanchel'],
  'Centro': ['Embajadores-Lavapies', 'Justicia-Chueca', 'Palacio', 'Sol', 'Universidad-Malasana', 'Cortes-Huertas'],
  'Chamartin': ['Castilla', 'Ciudad Jardin', 'El Viso', 'Hispanoamerica', 'Nueva Espana', 'Prosperidad'],
  'Chamberi': ['Almagro', 'Arapiles', 'Gaztambide', 'Rios Rosas', 'Trafalgar', 'Vallehermoso'],
  'Ciudad Lineal': ['Colina', 'Concepción', 'Costillares', 'Pueblo Nuevo', 'Quintana', 'San Juan Bautista', 'San Pascual', 'Ventas'],
  'Fuencarral-El Pardo': ['El Pardo', 'Fuentelarreina', 'La Paz', 'Las Tablas', 'Mirasierra-Arroyo del Fresno', 'Montecarmelo', 'Penagrande', 'Valverde', 'Pilar'],
  'Hortaleza': ['Canillas', 'Pinar del Rey', 'Palomas', 'Valdebebas-Valdefuentes', 'Piovera', 'Apostol Santiago', 'Sanchinarro', 'Virgen del Cortijo-Manoteras'],
  'Latina': ['Aluche', 'Campamento', 'Cuatro Vientos', 'Las Aguilas', 'Lucero', 'Carmenes', 'Puerta del Angel'],
  'Moncloa-Aravaca': ['Arguelles', 'Casa de Campo', 'Ciudad Universitaria', 'Valdezarza', 'Valdemarin', 'Aravaca', 'El Plantio'],
  'Moratalaz': ['Media Legua', 'Marroquina', 'Pavones', 'Vinateros', 'Fontarron'],
  'Puente de Vallecas': ['Entrevias', 'Numancia', 'Palomeras Bajas', 'Palomeras Sureste', 'Portazgo', 'San Diego'],
  'Retiro': ['Adelfas', 'Estrella', 'Ibiza', 'Jeronimos', 'Nino Jesus', 'Pacifico'],
  'Salamanca': ['Castellana', 'Fuente del Berro', 'Goya', 'Guindalera', 'Lista', 'Recoletos'],
  'San Blas': ['Amposta', 'Arcos', 'Canillejas', 'Hellin', 'Rosas', 'Rejas', 'Salvador', 'Simancas'],
  'Tetuan': ['Almenara', 'Bellas Vistas', 'Berruguete', 'Castillejos', 'Cuatro Caminos', 'Valdeacederas'],
  'Usera': ['Almendrales', 'Moscardo', 'Orcasitas', 'Orcasur', 'Pradolongo', 'San Fermin', 'Zofio'],
  'Vicalvaro': ['Ambroz', 'Centro Historico', 'El Canaveral', 'Valdebernardo', 'Valderribas'],
  'Villa de Vallecas': ['Casco Historico de Vallecas', 'Santa Eugenia', 'Ensanche de Vallecas-Valdecarros'],
  'Villaverde': ['Butarque', 'Los Angeles', 'Los Rosales', 'San Andres', 'San Cristobal']
};

const features = [
  { name: "piscina", label: "Piscina" },
  { name: "terraza", label: "Terraza" },
  { name: "jardin", label: "Jardín" },
  { name: "garaje", label: "Garaje" },
  { name: "trastero", label: "Trastero" },
  { name: "calefaccion", label: "Calefacción" },
  { name: "aire_acondicionado", label: "Aire Acondicionado" },
  { name: "ascensor", label: "Ascensor" },
];

export default function PredictionForm({ onPrediction, onLoading }) {
  const [formData, setFormData] = useState({
    tipo_vivienda: "Piso",
    distrito: "Arganzuela",
    zona: "Acacias",
    piscina: "0",
    terraza: "0",
    jardin: "0",
    garaje: "0",
    trastero: "0",
    calefaccion: "0",
    aire_acondicionado: "0",
    ascensor: "0",
    superficie_construida: 50,
    habitaciones: 2,
    baños: 1
  });

  const [zonasOptions, setZonasOptions] = useState(distritoZonas[formData.distrito]);

  useEffect(() => {
    setZonasOptions(distritoZonas[formData.distrito]);
    setFormData(prev => ({ ...prev, zona: distritoZonas[formData.distrito][0] }));
  }, [formData.distrito]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    onLoading(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/predecir_precio",
        formData
      );
      onPrediction(response.data);
    } catch (error) {
      console.error(error);
      onPrediction({ precio_estimado: 0, mensaje: "Error al predecir", success: false });
    } finally {
      onLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-screen-xl mx-auto bg-white p-10 rounded-3xl shadow-xl space-y-2"
    >

      <h2 className="text-3xl font-display font-bold text-primary text-center mb-4">
        Información de la Vivienda
      </h2>

      {/* Tipo de Vivienda */}
      <div>
        <label className="block mb-2 font-semibold text-gray-700 text-lg">Tipo de Vivienda:</label>
        <select
          name="tipo_vivienda"
          value={formData.tipo_vivienda}
          onChange={handleChange}
          className="w-full min-w-full border rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {["Piso","Duplex","Chalet","Casa","Atico","Apartamento"].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Distrito */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700 text-lg">Distrito:</label>
        <select
          name="distrito"
          value={formData.distrito}
          onChange={(e) => {
            const selectedDistrito = e.target.value;
            setFormData(prev => ({
              ...prev,
              distrito: selectedDistrito,
              zona: distritoZonas[selectedDistrito][0] // actualizar zona al primer valor
            }));
            setZonasOptions(distritoZonas[selectedDistrito]);
          }}
          className="w-full border rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {Object.keys(distritoZonas).sort().map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
      
      {/* Zona */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700 text-lg">Zona:</label>
        <select
          name="zona"
          value={formData.zona}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {zonasOptions.map(z => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
      </div>

      {/* Superficie */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700 text-lg">Superficie (m²):</label>
        <input
          type="number"
          name="superficie_construida"
          min="14" max="714"
          value={formData.superficie_construida}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      
      {/* Habitaciones */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700 text-lg">Habitaciones:</label>
        <input
          type="number"
          name="habitaciones"
          min="1" max="8"
          value={formData.habitaciones}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      
      {/* Baños */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700 text-lg">Baños:</label>
        <input
          type="number"
          name="baños"
          min="1" max="8"
          value={formData.baños}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div className="space-y-8">
        {/* Características */}
        <div>
          <label className="block mb-3 font-semibold text-gray-700 text-lg">Características:</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {features.map(f => (
              <div
                key={f.name}
                className="flex justify-between items-center bg-gray-100 rounded-xl px-4 py-3 cursor-pointer hover:bg-primary/20 transition min-w-[200px]"
                onClick={() =>
                  setFormData(prev => ({ ...prev, [f.name]: prev[f.name] === "0" ? "1" : "0" }))
                }
              >
                <span className="text-base font-medium truncate">{f.label}</span>
                <span
                  className={`px-3 py-1 rounded-full text-white font-semibold text-sm flex-shrink-0 ${
                    formData[f.name] === "1" ? "bg-primary" : "bg-gray-400"
                  }`}
                >
                  {formData[f.name] === "1" ? "Sí" : "No"}
                </span>
              </div>
            ))}
          </div>
        </div>
      
        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-primary text-white font-bold text-lg py-4 rounded-2xl hover:bg-primary/90 transition"
        >
          Predecir Precio
        </button>
      </div>

    </form>
  );
}
