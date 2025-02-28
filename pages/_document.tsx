import { Html, Head, Main, NextScript } from 'next/document'


export default function Document() {
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/DartApp" : "";
	return (
		<Html lang='en'>
			<Head>
				<meta charSet='utf-8' />
				<link rel='icon' type='image/png' href='/images/favicon.png' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1, user-scalable=0, viewport-fit=cover'
				/>
				<link rel="manifest" href={`${basePath}/manifest.json`} />


				<meta name="theme-color" content="#18181b" media="(prefers-color-scheme: dark)" />
				<meta name="theme-color" content="#f4f4f5" media="(prefers-color-scheme: light)" />

				<link rel='apple-touch-icon' href='/images/icon-maskable-512.png' />
				<link rel='manifest' href='/manifest.json' />
				
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
				<meta name="apple-mobile-web-app-title" content="DartApp" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
