import { AppBar, Box, Container, FormControl, Grid, InputAdornment, OutlinedInput, Paper, Toolbar, Typography } from '@material-ui/core';
import { Send } from '@mui/icons-material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ChatList, MessageBox } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import { useHistory } from 'react-router';
import Stomp from 'react-stomp';
import Logo from '../../assets/images/logo.png';
import Market from '../../assets/images/market.svg';
import UserSvg from '../../assets/images/user-svg.svg';
import IconButton from '../../components/icon-button';
import Modal from '../../components/modal';
import Title from '../../components/title';
import { AuthContext } from '../../context/AuthContext';
import { wsFactory } from '../../routers/RoutesLayout';
import api from '../../service/api';
import { request } from '../../service/request';
import { API_METHOD } from '../../utility/constant';
import useStyles from './styles';

const MessageContainer = (props) => {
  const { data } = props;

  const { state } = useContext(AuthContext);
  const storeId = state.user?.storeId;

  const classes = useStyles();

  return (
    <>
      {
        data.map((item, idx) => {
          // store pov
          let position = storeId && item.to === 'SysAd' ? 'right' : 'left';
          let cls = storeId && item.to === 'SysAd' ? classes.messageRight : classes.messageLeft;
          // dev pov
          position = !storeId && item.to === 'Store' ? 'right' : position;
          cls = !storeId && item.to === 'Store' ? classes.messageRight : cls;

          return (
            <MessageBox
              key={idx}
              position={position}
              type={'text'}
              className={cls}
              date={item.ts}
              text={item.content}
              data={{
                uri: Logo,
                status: {
                  click: false,
                  loading: 0,
                }
            }} />
          )
        })
      }
    </>
  )
}

const Messages = (props) => {

  const classes = useStyles();
  
  const { state } = useContext(AuthContext);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteList, setDeleteList] = useState([]);
  
  const [data, setData]               = useState([]);
  const [isLoading, setIsLoading]     = useState(false);

  const [input, setInput] = useState('');

  const [messages, setMessage] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [wsSysAd, setWsSysAd]= useState(wsFactory.systemAd);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selected, setSelected] = useState('');

  const stompRef = useRef();

  const getData = async () => {
    setIsLoading(true);
  
    const storeId = parseInt(state.user?.storeId);
    const params = storeId ? { storeId } : { type: 1 };
  
    try {
      const response = await request({
        url: storeId 
          ? `${api.CHAT_ROOMS_API}/search/findByStoreStoreId`
          : `${api.CHAT_ROOMS_API}/search/findByType`,
        method: API_METHOD.GET,
        params: {
          ...params,
          size: 10000
        },
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
  
      const { chatRooms } = response.data._embedded;
  
      // Prepare the promises for all chat room processing
      const chatRoomPromises = chatRooms.map(async (op) => {
        const chatRoomId = op._links.self.href.replace(`${api.CHAT_ROOMS_API}/`, '');
        if (storeId) {
          if (op.type === 1) {
            setWsSysAd((prev) => ({
              ...prev,
              topics: [...prev.topics, `/topic/store/${storeId}`],
            }));
  
            return {
              ...op,
              storeId,
              chatRoomId: chatRoomId,
              avatar: Logo,
              alt: op.name,
              title: op.name,
              subtitle: '',
              date: new Date(),
              unread: 0,
            };
          }
  
          const link = op._links.user.href;
          const newResponse = await request({ url: link, method: API_METHOD.GET, params: {
            size: 10000
          } });
          const userId = newResponse.data._links.self.href.replace(`${api.USERS_API}/`, '');
  
          setWsSysAd((prev) => ({
            ...prev,
            topics: [...prev.topics, `/topic/user/${userId}`],
          }));
  
          return {
            ...op,
            userId,
            storeId,
            chatRoomId: chatRoomId,
            avatar: UserSvg,
            alt: `${newResponse.data.lastName}, ${newResponse.data.firstName.charAt(0)}`,
            title: `${newResponse.data.lastName}, ${newResponse.data.firstName.charAt(0)}`,
            subtitle: '',
            // date: new Date(),
            unread: 0,
          };
        } else {
          const link = op._links.store.href;
          const newResponse = await request({ url: link, method: API_METHOD.GET, params: {
            size: 10000
          } });
          const newStoreId = newResponse.data._links.self.href.replace(`${api.STORE_API}/`, '');
  
          setWsSysAd((prev) => ({
            ...prev,
            topics: [...prev.topics, `/topic/store/${newStoreId}`],
          }));
  
          return {
            ...op,
            storeName: newResponse.data.name,
            chatRoomId: chatRoomId,
            storeId: newStoreId,
            avatar: Market,
            alt: newResponse.data.name,
            title: newResponse.data.name,
            subtitle: '',
            // date: new Date(),
            unread: 0,
          };
        }
      });
  
      // Resolve all promises at once
      const chatList = await Promise.all(chatRoomPromises);
      setChatList(chatList);
  
      // Process first chat room for messages
      const firstChatRoom = chatList[0];
      if (firstChatRoom) {
        await getMessges(firstChatRoom);
      }
  
      console.log('response', response);
    } catch (e) {
      console.error('Error:', e);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const getMessges = async (chatRoom) => {
    console.log('chatRoom', chatRoom);

    const messageLink = chatRoom._links.messages.href;
    const response = await request({
      url: messageLink,
      method: API_METHOD.GET,
      params: {
        size: 10000
      }
    });

    const { messages : newMessages} = response.data._embedded;

    const nMessages = newMessages.map(item => {
      return {
        ...item,
        chatRoomId: parseInt(chatRoom.chatRoomId),
        storeId: chatRoom.storeId,
      }
    })

    setMessage(nMessages?.reverse());
    setSelectedMessage(chatRoom);
    if (nMessages.length) {
      const firsM = nMessages[0];
      setChatList(prev => {
        return prev.map(item => {
          if (parseInt(item.chatRoomId) === parseInt(firsM.chatRoomId)) {
            return {
              ...item,
              date: firsM.ts,
              subtitle: ''
            }
          }
          return item;
        })
      })
    }

  }

  const handleUpdateData = async(ids) => {
    const newItems = data.filter(prev => {
      return !ids.includes(prev.id)
    });
    await getData();
  }

  useEffect(() => {
    getData();

    return () => {
      setData([])
    }
  }, []);
// ---------------

console.log('wsSysAd', wsSysAd)
  const handleDelete = async () => {
    // try {
    //   await multipleRequest(deleteIdList.map(async(value) =>
    //     await request({
    //       url: `${api.PRODUCT_CATEGORY_API}/${parseInt(value)}`,
    //       method: API_METHOD.DELETE
    //     })
    //   )) 
    //   notify('success', `The product category id ${deleteIdList[0]} has been deleted successfully!`);
    // } catch(er) {
    //   console.log('error?.response?.status', er?.response)
    //   if (er?.response?.status === 400) {
    //     notify('error', `Product category ${deleteIdList[0]} is currently associated with product items. Cannot be deleted!`);
    //   } else {
    //     notify('error', `Failed to delete product category id ${deleteIdList[0]}!`);
    //   }
    // }

    // handleCloseDeleteModal();
    // handleUpdateData(deleteIdList);
  }

  // const handleOpenDeleteModal = (values) => {
  //   console.log('values', values)
  //   setDeleteOpen(true);
  //   setDeleteIdList([values.id]);
  //   setDeleteList([values.categoryName])
  // }

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false);
  }

  const handleSendMessage = async() => {
    let payload =  {
      chatRoomId: selectedMessage.chatRoomId,
      content: input, 
      storeId: parseInt(state.user.storeId), 
      name: selectedMessage.name,
      to: 'SysAd'
    }
    
    if (!parseInt(state.user.storeId)) {
      payload =  {
        chatRoomId: selectedMessage.chatRoomId,
        content: input, 
        storeId: parseInt(selectedMessage.storeId), 
        name: selectedMessage.name,
        to: 'Store'
      }
    }

    if (selected.userId) {
      try {
        await request({
          url: api.WEBSOCKET_API + '/store',
          method: API_METHOD.POST,
          data: {
            chatRoomId: selectedMessage.chatRoomId,
            content: input, 
            userId: parseInt(selected.userId),
            storeId: parseInt(state.user.storeId), 
            name: selectedMessage.name,
            to: 'SysAd'
          },
          headers: {
            'Content-Type': 'application/json'
          },
        })
      } catch {
  
      }
    } else {
      try {
        await request({
          url: api.WEBSOCKET_API + '/system-admin',
          method: API_METHOD.POST,
          data: payload,
          headers: {
            'Content-Type': 'application/json'
          },
        })
      } catch {
  
      }
    }

    setChatList(prev => {
      return prev.map(item => {
        if (item.storeId === selectedMessage.storeId) {
          return {
            ...item,
            date: new Date(),
            subtitle: ''
          }
        }
        return item;
      })
    })

    setInput('');
  }

  const handleWSMessage = (message) => {
    console.log('Message', message)
    const storeId = state.user?.storeId;

    
    console.log('Store', storeId)
    setChatList(prev => {
      return prev.map(item => {
        let position = storeId && message.to === 'SysAd' ? 0 : item.unread + 1;
        position = !storeId && message.to === 'Store' ? 0 : position;
        if (parseInt(item.chatRoomId) === parseInt(message.chatRoomId)) {
          return {
            ...item,
            date: new Date(),
            subtitle: '',
            unread: position
          }
        }
        return item;
      })
    })
		setMessage(prev => [{...message, ts: new Date()}, ...prev]);
	}

  const handeChangeMessage = (e) => {
    setInput(e.target.value)
  }

  const handleClickChatRoom = async (object) => {
    setSelected(object);
    setChatList(prev => {
      return prev.map(item => {
        if (parseInt(item.storeId) === parseInt(object.storeId)) {
          return {
            ...item,
            date: new Date(),
            subtitle: '',
            unread: 0
          }
        }
        return item;
      })
    })
    await getMessges(object)
  }
  
  return (
    <Container className={classes.container} style={{ margin : '0px'}}>
      {
        isLoading ?
        <></>
      :
        <Stomp
          {...wsSysAd}
          onMessage={handleWSMessage}
          ref={stompRef}
        />
      }
      <Title name='Messages'/>
      <Paper className={classes.paper} sx={{ width: '100%', mb: 2, boxShadow: 4 }}>
        <Grid container style={{ marginBottom: '16px', height: '100%' }}>
          <Grid item xl={3} lg={3} md={3} xs={3} sm={3} style={{ padding: '8px', height: '75vh', overflow: 'scroll', background: '#ffff', borderRight: '0.5px solid #e8e2e2'}}>
            <ChatList 
              className='chat-list'
              dataSource={chatList}
              onClick={handleClickChatRoom}
            />
          </Grid>
          <Grid item xl={9} lg={9} md={9} xs={9} sm={9} >
            <AppBar position="relative">
              <Toolbar>
                {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                  <MenuIcon />
                  </IconButton> */}
                <Typography variant="h6" className={classes.title}>
                  {selectedMessage?.title}
                </Typography>
                
              </Toolbar>
            </AppBar>
            <Box style={{ height: '67vh', overflow: 'hidden' }}> {/* Main container */}
              <Box
                style={{
                  padding: '8px',
                  height: '100%',
                  background: 'rgb(239, 239, 239)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Scrollable inner container */}
                <Box
                  style={{
                    flexGrow: 1, /* Take available space */
                    overflowY: 'auto', /* Enable vertical scrolling */
                    display: 'flex', /* Use flex to manage the chat items */
                    flexDirection: 'column-reverse', /* Reverse order for chat flow */
                  }}
                >
                  <MessageContainer data={messages} />
                </Box>
              </Box>
            </Box>


            <Box style={{ background: '#ffff', border: '0.5px solid #e8e2e2'}}>
            <FormControl
                className={`${classes.inputForm}`} size='medium' variant="outlined"
              >
                <OutlinedInput
                  id="send"
                  type={'text'}
                  fullWidth
                  size='medium'
                  autoFocus
                  value={input}
                  onChange={handeChangeMessage}
                  endAdornment={
                    <InputAdornment position="end">
                    <IconButton title='Send' icon={<Send fontSize='medium' />} handleClick={handleSendMessage} />
                   </InputAdornment>
                  }
                  placeholder='Type here...'
                />
              </FormControl>
              
            </Box>
          </Grid>

        </Grid>
      </Paper>
      <Modal 
        open={deleteOpen} 
        handleClose={handleCloseDeleteModal} 
        handleSubmit={handleDelete} 
        buttonName='Delete'
        image={''}
        title='Delete Message'
      >
        <Box className={classes.deleteContent}>
          Are you sure you want to delete { deleteList.join(', ')}?
        </Box>
      </Modal>
    </Container>
  )
}

export default Messages