import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PredictionForm from './components/PredictionForm'
import ResultCard from './components/ResultCard'

function App() {
  const [prediction, setPrediction] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handlePrediction = (result) => {
    setPrediction(result)
  }

  const handleLoading = (loading) => {
    setIsLoading(loading)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, currentColor 35px, currentColor 36px),
                           repeating-linear-gradient(-45deg, transparent, transparent 35px, currentColor 35px, currentColor 36px)`
        }} />
      </div>

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-screen-2xl mx-auto">
          {/* Intro Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-7">
              Calculadora de Precios de Viviendas - Madrid Capital
            </h2>

            {/* Placeholder movido aquí */}
            {!isLoading && !prediction && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl shadow-xl p-12 text-white text-center max-w-7xl mx-auto"
              >
                <div className="text-7xl mb-4 animate-float">🏠</div>
                <h3 className="text-3xl font-display font-bold mb-3">
                  ¿Listo para descubrir el valor de su propiedad?
                </h3>
                <p className="text-white/180 text-xl">
                  Rellene el formulario con la información de su vivienda y obtenga una estimación precisa al instante.
                </p>
                <p className="text-white/60 mt-3 text-l">
                  *Nota: La primera estimación puede tardar unos minutos en obtenerse pues la aplicación necesita conectarse con el servidor.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Main Content Grid */}
          <div className="w-full max-w-screen-2xl mx-auto">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <PredictionForm 
                onPrediction={handlePrediction}
                onLoading={handleLoading}
              />
            </motion.div>

            {/* Result */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:sticky lg:top-8"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-3xl shadow-xl p-12 text-center"
                  >
                    <div className="inline-block w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-gray-600 font-medium">Calculando precio...</p>
                  </motion.div>
                ) : prediction ? (
                  <ResultCard key="result" prediction={prediction} />
                ) : null}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: '🤖',
                title: 'Inteligencia Artificial',
                description: 'Modelo de IA entrenado con miles de datos reales del mercado madrileño'
              },
              {
                icon: '⚡',
                title: 'Resultados Instantáneos',
                description: 'Obtén tu estimación en menos que canta un gallo'
              },
              {
                icon: '🎯',
                title: 'Alta Precisión',
                description: 'Algoritmos avanzados para predicciones precisas y confiables'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

    </div>
  )
}

export default App
