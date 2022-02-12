import Head from 'next/head';

interface HelmetProps {
    title: string
}

const Helmet = ({ title }: HelmetProps): JSX.Element => (
    <Head>
        <title>{title}</title>
    </Head>
)

export default Helmet
