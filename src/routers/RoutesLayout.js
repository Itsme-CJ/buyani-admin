import React, { useContext, useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../context/AuthContext';
import Stomp from 'react-stomp';
import sound from '../assets/notif.mp3';

const url      = window.WEBSOCKET_PATH;
const wsPrefix = '/websocket';

export const wsFactory = {
  systemAd: {
    url   : url + wsPrefix,
    topics: [],
    onConnect: () => {
      console.log("Connected to Websocket...", url + wsPrefix);
    },
    onDisconnect: (e) => {
      console.log("Disconnected to Websocket...",  e);
    },
    // heartbeatIncoming: 0,
    // heartbeatOutgoing: 20000,
    autoReconnect    : true,
    onConnectFailure : (err) => {
      console.log("connection failed: ", err)
    }
  },
}

const RoutesLayout = (props) => {
  const { exact, component: Component, layout: Layout, path } = props;

	const { state } = useContext(AuthContext);
  const { user } = state;

	const [ws, setWs] = useState(wsFactory.systemAd);
	useEffect(() => {
		if (user?.storeId) {
			setWs((prev) => ({
				...prev,
				topics: [...prev.topics, `/topic/notif/${user?.storeId}`],
			}));
		}
	}, [])

	const notify = (type, message) => 	{
		const option = {
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
			transition: Bounce,
		}
		if (type === 'success') {
			toast.success(message, option);
		} else {
			toast.error(message, option);
		}
	}

	const handleWSMessage = (message) => {
		const audio = new Audio(sound);
		audio.play();
		const option = {
			position: "top-right",
			autoClose: false,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
			transition: Bounce,
		}
		toast.info('New customer reservation received: ' + message.name, option);
	}

	console.log('ws',ws)

  return (
		<>
			<Stomp
        {...ws}
        onMessage={handleWSMessage}
        />
			<Route
				exact={exact}
				path={path}
				render={(routeProps) =>
					<Layout {...props}>
						<Component {...routeProps}  notify={notify}/>
						<ToastContainer />
					</Layout>
				}
			/>
		</>
  )
}

export default RoutesLayout