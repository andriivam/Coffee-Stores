import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Banner from '../../components/banner';
import Card from '../../components/card';
import Image from 'next/image';
import fetchCoffeeStores from '../../lib/coffee-stores';
import useTrackLocation from '../../hooks/use-track-location';
import { useEffect, useState, useContext } from 'react';
import { ACTION_TYPES, StoreContext } from '../../context/store-context';

export async function getStaticProps(context) {

  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores,
    },
  };
}


export default function Home(props) {

  const { handleTrackLocation, locationErrorMsg, isFindingLocation } = useTrackLocation();

  const [coffeeStoresError, setCoffeeStoresError] = useState(null);
  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;

  useEffect(() => {
    const setCoffeeStoresByLocation = async () => {
      if (latLong) {
        try {
          const response = await fetch(`/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`);
          const coffeeStores = await response.json();

          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores
            }
          })
          setCoffeeStoresError("");
        }
        catch (err) {
          console.error({ err });
          setCoffeeStoresError(err.message);
        }
      }
    }
    setCoffeeStoresByLocation();
  }, [latLong, dispatch]);

  const handleOnBannerBtn = () => {
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Shops</title>
        <meta name="description" content="My study project about coffee shops" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Banner buttonText={isFindingLocation ? "Locating..." : "View stores nearby"} handleOnClick={handleOnBannerBtn} />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image src="/static/images/hero.png" alt="lady drink coffee" width={700} height={400} />
        </div>
        {/* Coffee stores near me */}
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map(coffeeStore => {
                return (
                  <Card
                    key={coffeeStore.id}
                    className={styles.card}
                    name={coffeeStore.name}
                    imgUrl={coffeeStore.imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"}
                    href={`/coffee-store/${coffeeStore.id}`} />
                )
              })}
            </div>
          </div>
        )}
        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Brussels coffee stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map(coffeeStore => {
                return (
                  <Card
                    key={coffeeStore.id}
                    className={styles.card}
                    name={coffeeStore.name}
                    imgUrl={coffeeStore.imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"}
                    href={`/coffee-store/${coffeeStore.id}`} />
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
