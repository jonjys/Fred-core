import { createAtom } from '../tunnel'
import { parseSwish } from '../parsers/swish'

export async function handleBankIDShield(userId: string, sharedText: string) {
  const swish = parseSwish(sharedText)

  if (!swish?.amount ||!swish?.phone) {
    throw new Error('BankIDShield: Hittade inget belopp eller nummer att skydda.')
  }

  // Skapa atom som triggar en 5-sekunders paus på alla devices
  return createAtom(userId, 'bankid', 'payment_shield', {
   ...swish,
    action: 'pause_5_sec',
    warning: `Du är på väg att skicka ${swish.amount} kr till ${swish.phone}. Säker?`
  })
}