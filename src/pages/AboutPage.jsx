import Container from "../components/Container";

export default function AboutPage() {
  return (
    <div className='page-about'>
      <Container>
        <div className="content-hold">
          <div className="content">
        
            <h1 className="title">Začíname s LPWAN</h1>
            <p className="subtitle">Zoznámte sa so mnou a mojím kurzom</p>

            <div className="card">
              <img
                src="/img/me.jpg"
                alt="Profile"
                className="profile-photo"
              />
              <h2 className="name">O mne </h2>
              <p className="description">
                Ahoj, volám sa Daria a som Ukrajinka, ktorá sa rozhodla študovať informačné technológie na Slovensku.
                Moja vášeň pre technológie ma priviedla k tomu, aby som sa zamerala na oblasť Low-Power Wide-Area Networks (LPWAN),
                ktorá sa stáva čoraz dôležitejšou v súčasnom digitálnom svete. V rámci mojej bakalárskej práce sa snažím vytvoriť aplikáciu,
                ktorá umožní lepšie porozumieť tejto fascinujúcej technológii a jej aplikáciám v reálnom svete. Verím, že LPWAN má potenciál
                zmeniť spôsob, akým komunikujeme s technológiami a zariadeniami okolo nás.
              </p>
              {/* <button className="meet-button">Meet Me</button> */}
            </div>

            <div className="course-info">
              <h2 className="course-title">O kurze</h2>

              <div className="content-wrapper">             

                <div className="features">
                  <div id="feature-card-1" className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-paint-brush"></i>
                    </div>
                    <h3>Vitajte v kurze</h3>
                    <p>Vitajte v kurze, ktorý je venovaný svetu Low-Power Wide-Area Networks
                      (LPWAN)! Tento kurz je určený pre študentov, ktorí sa zaujímajú o moderné technológie
                      a ich praktické využitie. </p>
                  </div>
                  <div id="feature-card-2" className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-font"></i>
                    </div>
                    <h3>Čo sa naučíte</h3>
                    <p>Počas tohto kurzu sa naučíte základy LPWAN technológie, architektúru sietí,
                      bezpečnostné aspekty a praktické aplikácie. Okrem toho sa zameriame na konkrétne technológie
                      ako Wi-Fi HaLow a LTE-M, ktoré sú populárne pre svoje výhody v nízkej spotrebe energie a širokom dosahu.</p>
                  </div>
                  <div id="feature-card-3" className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-palette"></i>
                    </div>
                    <h3>Metodika kurzu</h3>
                    <p>Kurz kombinuje teoretické vedomosti s praktickými cvičeniami, aby ste získali komplexný prehľad o tom, ako LPWAN funguje a ako ho môžete využiť vo vlastných projektoch. </p>
                  </div>
                  <div id="feature-card-4" className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-layer-group"></i>
                    </div>
                    <h3>Carefully Named Layers</h3>
                    <p>At first, for some time, I was not able to answer him one word.</p>
                  </div>
                </div>

                <div className="phone-image-container">
                  <img src="/img/mobil.jpg" alt="Phone" className="phone-image" />
                </div>
              </div>
              <p className="course-subtitle">
                Teším sa na vašu účasť a na to, ako spolu objavíme fascinujúci svet LPWAN!
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
