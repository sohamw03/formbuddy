import { auth } from "../[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();
  console.log('Callback session data:', session);

  return new NextResponse(`
    <html>
      <body>
        <script>
          console.log('Extension callback loaded');
          console.log('Session data:', ${JSON.stringify(session)});

          // Send message to extension
          chrome.runtime.sendMessage('gjikhpiildefcfiaajajjoobadhadfoe', {
            type: 'AUTH_CALLBACK',
            session: ${JSON.stringify(session)}
          }, function(response) {
            console.log('Message sent to extension', response);
            window.close();
          });
        </script>
        <div>Completing authentication...</div>
      </body>
    </html>
  `, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
