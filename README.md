## KSP sortiment

### Čo je sortiment?

Sortiment je aplikácia na zjednodušenie fungovania KSP bufetu. Jej cieľom je zjednodušenie logistiky procesov okolo bufetu, aby boli ceny vždy aktuálne a potenciálne existujúce jedlo v rohu ľahko identifikovateľné. Je hlavne dezignovaná na použitie v miestnosti T2 (a potenciálne aj v iných) hlavne členmi KSP, ale aj taktiež ostatními členmi [Trojstenu](https://www.trojsten).

### Ako spustiť sortiment-a?

Treba mať Node.js v6 (najlepšie LTS v6.9.2). Najlepšie je nainštalovať cez [NVM](https://github.com/creationix/nvm)

Pre development aj produkciu treba zbehnúť
```
git clone https://github.com/kubik369/ksp-sortiment.git
cd ksp-sortiment
cp sortiment-template.sqlite sortiment.sqlite
npm install
```

Pre development webpack server

```
npm run dev
```

Generácia static bundle-u pre produkciu a spustenie

```
npm run build-production
npm start
```
