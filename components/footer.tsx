"use client"

export function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl" aria-hidden="true">
                🦷
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-white text-base">MUDr. Jana Nováková</span>
                <span className="text-sm text-gray-400">Zubní ordinace</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Moderní zubní péče v srdci Plzně s více než 15 lety zkušeností.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Rychlé odkazy</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Domů
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  O nás
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Služby
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Kontakt
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">Kontakt</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Hlavní 123, 301 00 Plzeň</li>
              <li>
                <a href="tel:+420776123456" className="hover:text-white transition-colors">
                  +420 776 123 456
                </a>
              </li>
              <li>
                <a href="mailto:info@ordinace-novakova.cz" className="hover:text-white transition-colors">
                  info@ordinace-novakova.cz
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} MUDr. Jana Nováková - Zubní ordinace. Všechna práva vyhrazena.
          </p>
          <p className="text-xs text-gray-500 mt-2">DEMO aplikace - vytvořeno SMLK</p>
        </div>
      </div>
    </footer>
  )
}
