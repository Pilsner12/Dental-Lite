import { Smartphone } from "lucide-react"

export function AboutSection({ showSmsBadge = false }: { showSmsBadge?: boolean }) {
  return (
    <section id="about" className="py-16 md:py-24 bg-[#f8fafc]">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Image */}
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
            <img
              src="/professional-female-dentist-portrait-smiling-frien.jpg"
              alt="MUDr. Jana Nováková"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">O nás</h2>
              <div className="w-20 h-1 bg-[#059669]"></div>
              {showSmsBadge && (
                <div className="mt-4 inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Smartphone className="w-4 h-4" />
                  Posíláme SMS připomínky
                </div>
              )}
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              S praxí více než 15 let poskytujeme komplexní zubní péči v příjemném prostředí. Zaměřujeme se na prevenci
              a individuální přístup ke každému pacientovi.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-[#2563eb]">15+</div>
                <div className="text-sm text-gray-600">Let praxe</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-[#2563eb]">5000+</div>
                <div className="text-sm text-gray-600">Spokojených pacientů</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-[#2563eb]">100%</div>
                <div className="text-sm text-gray-600">Moderní vybavení</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-[#2563eb]">24/7</div>
                <div className="text-sm text-gray-600">Online objednávky</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
