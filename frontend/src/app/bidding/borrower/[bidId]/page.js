// src/app/bidding/borrower/[bidId]/page.js
// Server component — extracts params synchronously and mounts client UI
import BorrowerBidClient from './BorrowerBidClient'

export default function Page({ params }) {
  const { bidId } = params // safe on server
  return <BorrowerBidClient bidId={bidId} />
}
