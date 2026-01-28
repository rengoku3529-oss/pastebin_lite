// import Link from 'next/link';

// export default function NotFound() {
//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <div className="text-center animate-fade-in">
//         <div className="mb-8">
//           <h1 className="text-9xl font-bold text-terminal-red glow-green mb-4">
//             404
//           </h1>
//           <h2 className="text-3xl font-bold text-terminal-cyan mb-2">
//             PASTE_NOT_FOUND
//           </h2>
//           <p className="text-gray-400 text-lg">
//             This paste doesn't exist, has expired, or view limit exceeded
//           </p>
//         </div>

//         <div className="space-y-4">
//           <div className="inline-block px-6 py-3 bg-terminal-surface border border-terminal-red/30 rounded-lg">
//             <p className="text-terminal-red font-mono text-sm">
//               ERROR: Resource unavailable
//             </p>
//           </div>

//           <div>
//             <Link
//               href="/"
//               className="btn-terminal-primary inline-block"
//             >
//               ← Return Home
//             </Link>
//           </div>
//         </div>

//         <div className="mt-12 text-gray-600 text-sm space-y-2">
//           <p>Possible reasons:</p>
//           <ul className="text-xs space-y-1">
//             <li>• Paste ID is invalid</li>
//             <li>• TTL expired</li>
//             <li>• View limit reached</li>
//             <li>• Paste was deleted</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }


import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center animate-fade-in">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-terminal-red glow-green mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-terminal-cyan mb-2">
            PASTE_NOT_FOUND
          </h2>
<p className="text-gray-400 text-lg">
  {"This paste doesn't exist, has expired, or view limit exceeded"}
</p>

        </div>

        <div className="space-y-4">
          <div className="inline-block px-6 py-3 bg-terminal-surface border border-terminal-red/30 rounded-lg">
            <p className="text-terminal-red font-mono text-sm">
              ERROR: Resource unavailable
            </p>
          </div>

          <div>
            <Link href="/" className="btn-terminal-primary inline-block">
              ← Return Home
            </Link>
          </div>
        </div>

        <div className="mt-12 text-gray-600 text-sm space-y-2">
          <p>Possible reasons:</p>
          <ul className="text-xs space-y-1">
            <li>• Paste ID is invalid</li>
            <li>• TTL expired</li>
            <li>• View limit reached</li>
            <li>• Paste was deleted</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
