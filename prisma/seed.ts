import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  {
    title: 'Carrier 24ACC636A003 3-Ton Central AC',
    model: '24ACC636A003',
    serialNumber: 'CA2023-00112',
    shortDescription: 'Dent on side panel, compressor and electronics fully intact.',
    fullDescription: 'Carrier 3-ton split-system air conditioner with minor cosmetic damage on the right side panel. All mechanical and electrical components are in working order. Includes original documentation.',
    price: 1290,
    badge: 'clearance',
    images: '[]',
    mainImageIndex: 0,
  },
  {
    title: 'Lennox XC21-036 3-Ton Heat Pump',
    model: 'XC21-036',
    serialNumber: 'LX2022-88441',
    shortDescription: 'Scratch on top cover, refrigerant lines untouched.',
    fullDescription: 'Lennox high-efficiency heat pump with a visible scratch on the top cover from warehouse handling. Core refrigeration system and inverter board are in perfect condition. Ideal for residential installs.',
    price: 2150,
    badge: 'sale',
    images: '[]',
    mainImageIndex: 0,
  },
  {
    title: 'Trane XR15 2-Ton Air Conditioner',
    model: '4TTR5024J1000A',
    serialNumber: 'TR2023-55209',
    shortDescription: 'Corner dent, operates at full rated efficiency.',
    fullDescription: 'Trane XR15 2-ton unit with a corner dent from shipping. Refrigerant charge verified, all contactors and capacitors tested. Ready for installation. Full manufacturer warranty documentation available.',
    price: 980,
    badge: null,
    images: '[]',
    mainImageIndex: 0,
  },
  {
    title: 'Rheem RA1460AJ1NA 5-Ton Condenser',
    model: 'RA1460AJ1NA',
    serialNumber: 'RH2023-33017',
    shortDescription: 'Paint scuff on housing, all internal components intact.',
    fullDescription: 'Rheem 5-ton commercial-grade condenser with minor paint scuffing on the lower housing. Compressor tested under load. High-static fan motor intact. Suitable for light commercial or large residential applications.',
    price: 3400,
    badge: 'clearance',
    images: '[]',
    mainImageIndex: 0,
  },
  {
    title: 'Daikin DX13SA0243 2-Ton Split System',
    model: 'DX13SA0243',
    serialNumber: 'DK2022-71188',
    shortDescription: 'Cosmetic damage on cabinet, inverter board tested good.',
    fullDescription: 'Daikin 2-ton split system with cosmetic damage on the outer cabinet. The inverter drive and control board have been independently tested and confirmed operational. Refrigerant ports sealed and charged.',
    price: 1100,
    badge: null,
    images: '[]',
    mainImageIndex: 0,
  },
  {
    title: 'York YZV 4-Ton Variable Speed Heat Pump',
    model: 'YZV04824AAA',
    serialNumber: 'YK2023-90042',
    shortDescription: 'Dented base pan, variable speed drive and controls untouched.',
    fullDescription: 'York YZV variable-speed heat pump with a dented base pan from forklift contact. The inverter, control board, and refrigerant circuit are undamaged. This is a high-end unit offered at a significant discount due to cosmetic damage only.',
    price: 2890,
    badge: 'sale',
    images: '[]',
    mainImageIndex: 0,
  },
  {
    title: 'Goodman GSXN403610 3-Ton AC Unit',
    model: 'GSXN403610',
    serialNumber: 'GM2023-14477',
    shortDescription: 'Minor scratches, fully functional, great entry-level option.',
    fullDescription: 'Goodman 3-ton air conditioner with light surface scratches from transit. One of the most reliable entry-level units on the market. All contacts, capacitors, and refrigerant charge verified. Perfect for budget-conscious installs.',
    price: 740,
    badge: null,
    images: '[]',
    mainImageIndex: 0,
  },
]

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.model },
      update: {},
      create: { id: p.model, ...p },
    })
  }
  console.log('✓ Seeded 7 products')
}

main().catch(console.error).finally(() => prisma.$disconnect())
