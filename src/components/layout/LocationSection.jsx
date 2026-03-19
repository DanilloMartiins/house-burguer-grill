export function LocationSection() {
  return (
    <section className="location section" id="localizacao">
      <div className="container location-content">
        <div>
          <div className="section-title">
            <p className="section-tag">Onde estamos</p>
            <h2>Visite a House Burguer Grill</h2>
          </div>
          <p>
            Avenida Padre Rocha, 539 - São José, Carpina - PE
            <br />
            Ambiente aconchegante, luz quente e muito sabor para sua noite.
          </p>
        </div>

        <div className="map-wrapper" aria-label="Mapa de localização da hamburgueria">
          <iframe
            title="Mapa House Burguer Grill"
            src="https://www.google.com/maps?q=-7.841414656516435,-35.25344552269752&z=17&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
