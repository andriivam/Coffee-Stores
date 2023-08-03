import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import coffeeStoresData from '../../../data/coffee-stores.json'
import styles from '../../styles/coffee-store.module.css';
import Image from 'next/image';
import cls from 'classnames';
import fetchCoffeeStores from '../../../lib/coffee-stores';
import { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../../context/store-context';
import { isEmpty } from '../utils/index';

export async function getStaticProps(staticProps) {
    const params = staticProps.params;
    const coffeeStores = await fetchCoffeeStores();

    const findCoffeeStoreById = coffeeStores.find(coffeeStore => {
        return coffeeStore.id.toString() === params.id;
    })
    return {
        props: {
            coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {}
        },
    };
}


export async function getStaticPaths() {
    const coffeeStores = await fetchCoffeeStores();
    const paths = coffeeStores.map(coffeeStore => {
        return {
            params: {
                id: coffeeStore.id.toString()
            }
        }
    })
    return {
        paths,
        fallback: true
    }
}

const CoffeeStore = (initialProps) => {
    const [coffeeStore, setCoffeeStores] = useState(initialProps.coffeeStore);
    const { state: { coffeeStores },
    } = useContext(StoreContext);
    const router = useRouter();

    const id = router.query.id;

    useEffect(() => {
        if (isEmpty(initialProps.coffeeStore)) {
            if (coffeeStores.length > 0) {
                const findCoffeeStoreById = coffeeStores.find(coffeeStore => {
                    return coffeeStore.id.toString() === id;
                });
                setCoffeeStores(findCoffeeStoreById);
            }
        }
    }, [id]);



    if (router.isFallback) {
        return <div>Loading...</div>
    }

    const { address, postcode, name, imgUrl } = coffeeStore;

    const handleUpvoteButton = () => {
        console.log('handleUpvoteButton');
    };

    return (
        <div className={styles.layout}>
            <Head>
                <title>{name}</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.col1}>
                    <div className={styles.backToHomeLink}>
                        <Link className={styles.backHomeIcon} href="/"> ← Back to Home</Link>
                    </div>
                    <div className={styles.nameWrapper}>
                        <h1 className={styles.name}>{name}</h1>
                    </div>

                    <Image
                        src={imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"}
                        alt="coffee store"
                        width={600}
                        height={360}
                        className={styles.storeImg} />
                </div>
                <div className={cls("glass", styles.col2)}>
                    {address && (
                        <div className={styles.iconWrapper}>
                            <Image src="/static/icons/places.svg" alt="location icon" width={24} height={24} />
                            <p className={styles.text}>{address}</p>
                        </div>
                    )}
                    {postcode && (
                        <div className={styles.iconWrapper}>
                            <Image src="/static/icons/nearMe.svg" alt="location icon" width={24} height={24} />
                            <p className={styles.text}>{postcode}</p>
                        </div>
                    )}
                    <div className={styles.iconWrapper}>
                        <Image src="/static/icons/star.svg" alt="location icon" width={24} height={24} />
                        <p className={styles.text}>1</p>
                    </div>
                    <button className={styles.upvoteButton} onClick={handleUpvoteButton}>Up vote!</button>
                </div>
            </div>
        </div>
    )
}

export default CoffeeStore;

