import Head from 'next/head'
import Appbar from '@/components/appbar'
import BottomNav from '@/components/bottom-nav'

interface Props {
	title?: string
	children: React.ReactNode
}

const Page = ({ title, children }: Props) => (
	<>
		{title ? (
			<Head>
				<title>Dart Kjøret | {title}</title>
			</Head>
		) : null}

		<Appbar />

		<main
			/**
			 * Padding top = `appbar` height
			 * Padding bottom = `bottom-nav` height
			 */
			className='mx-auto max-w-screen-md pt-[var(--app-top-padding)] sm:pt-20 px-safe pb-[var(--app-bottom-padding)] sm:pb-0'
		>
			<div className='p-6'>{children}</div>
		</main>

		<BottomNav />
	</>
)

export default Page
