import Localfont from 'next/font/local'

export const suit = Localfont({
	src: [
		{
			path: '../assets/fonts/SUIT/SUIT-Thin.woff2',
			weight: '100',
			style: 'thin'
		},
		{
			path: '../assets/fonts/SUIT/SUIT-ExtraLight.woff2',
			weight: '200',
			style: 'extra-light'
		},
		{
			path: '../assets/fonts/SUIT/SUIT-Light.woff2',
			weight: '300',
			style: 'light'
		},
		{
			path: '../assets/fonts/SUIT/SUIT-Regular.woff2',
			weight: '400',
			style: 'normal'
		},
		{
			path: '../assets/fonts/SUIT/SUIT-Medium.woff2',
			weight: '500',
			style: 'medium'
		},
		{
			path: '../assets/fonts/SUIT/SUIT-SemiBold.woff2',
			weight: '600',
			style: 'semi-bold'
		},
		{
			path: '../assets/fonts/SUIT/SUIT-Bold.woff2',
			weight: '700',
			style: 'bold'
		},
		{
			path: '../assets/fonts/SUIT/SUIT-ExtraBold.woff2',
			weight: '800',
			style: 'extra-bold'
		},
		{
			path: '../assets/fonts/SUIT/SUIT-Heavy.woff2',
			weight: '900',
			style: 'heavy'
		}
	],
	variable: '--font-suit',
	display: 'swap'
})

export default suit
