// import React, { useState, useRef, useEffect } from 'react';
// import {
//   Box,
//   Flex,
//   Input,
//   Button,
//   VStack,
//   HStack,
//   Text,
//   Avatar,
//   IconButton,
//   useColorModeValue,
//   useBreakpointValue,
//   Drawer,
//   DrawerContent,
//   DrawerOverlay,
//   DrawerBody,
//   useDisclosure,
// } from '@chakra-ui/react';
// import { motion } from 'framer-motion';
// import { ChevronLeftIcon, HamburgerIcon } from '@chakra-ui/icons';
// import { useNavigate } from 'react-router-dom';
// import { chatAPI } from '../services/api';

// const MotionBox = motion(Box);

// const ChatInterface = () => {
//   console.log('ChatInterface component rendering'); // Add logging

//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [selectedAI, setSelectedAI] = useState('assistant');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSidebarOpen, setSidebarOpen] = useState(false); // Fix initial state
//   const messagesEndRef = useRef(null);
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const navigate = useNavigate();

//   const bgColor = useColorModeValue('white', 'gray.800');
//   const borderColor = useColorModeValue('gray.200', 'gray.600');
//   const isMobile = useBreakpointValue({ base: true, md: false });

//   useEffect(() => {
//     console.log('ChatInterface mounted'); // Add logging
//     setSidebarOpen(!isMobile); // Set sidebar state after mobile check
//   }, [isMobile]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const toggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//   };

//   const handleSend = async () => {
//     if (!input.trim() || isLoading) return;

//     const userMessage = {
//       content: input,
//       sender: 'user',
//       timestamp: new Date().toISOString(),
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       const response = await chatAPI.sendMessage(input, selectedAI);
//       console.log('Raw API response:', response); // Debug log
      
//       const aiMessage = {
//         content: response || 'No response received', // Direct use of response since it's already the answer string
//         sender: selectedAI,
//         timestamp: new Date().toISOString(),
//       };

//       setMessages(prev => [...prev, aiMessage]);
//     } catch (error) {
//       console.error('API Error:', error);
//       const errorMessage = {
//         content: 'Sorry, I encountered an error processing your request.',
//         sender: selectedAI,
//         timestamp: new Date().toISOString(),
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const Sidebar = () => (
//     <VStack spacing={4} align="stretch" w="full" p={4}>
//       <Text fontSize="lg" fontWeight="bold">AI Models</Text>
//       {['assistant', 'creative', 'technical', 'friendly'].map((ai) => (
//         <Button
//           key={ai}
//           variant={selectedAI === ai ? 'solid' : 'ghost'}
//           onClick={() => {
//             setSelectedAI(ai);
//             if (isMobile) onClose();
//           }}
//           colorScheme="blue"
//           w="full"
//           justifyContent="flex-start"
//           px={4}
//         >
//           {ai.charAt(0).toUpperCase() + ai.slice(1)}
//         </Button>
//       ))}
//     </VStack>
//   );

//   return (
//     <ErrorBoundary fallback={<Text p={4}>Something went wrong. Please try again.</Text>}>
//       <Flex h="100vh" direction="column">
//         <Box p={4} borderBottom="1px" borderColor={borderColor}>
//           <HStack justify="space-between">
//             <HStack spacing={4}>
//               <IconButton
//                 icon={<HamburgerIcon />}
//                 onClick={isMobile ? onOpen : toggleSidebar}
//                 variant="ghost"
//                 aria-label="Toggle Sidebar"
//               />
//               <IconButton
//                 icon={<ChevronLeftIcon />}
//                 onClick={() => navigate('/')}
//                 variant="ghost"
//                 aria-label="Back to home"
//               />
//               <Text fontSize="xl" fontWeight="bold">Chat with AI</Text>
//             </HStack>
//           </HStack>
//         </Box>

//         <Flex flex={1} overflow="hidden">
//           {!isMobile && (
//             <Box
//               w="240px"
//               borderRight="1px"
//               borderColor={borderColor}
//               display={isSidebarOpen ? 'block' : 'none'}
//               transition="all 0.3s"
//             >
//               <Sidebar />
//             </Box>
//           )}

//           <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
//             <DrawerOverlay />
//             <DrawerContent>
//               <DrawerBody p={0}>
//                 <Sidebar />
//               </DrawerBody>
//             </DrawerContent>
//           </Drawer>

//           <Flex flex={1} direction="column" bg={bgColor} p={4}>
//             <VStack flex={1} overflow="auto" spacing={4} align="stretch">
//               {messages.map((message, index) => (
//                 <MotionBox
//                   key={index}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3 }}
//                   alignSelf={message.sender === 'user' ? 'flex-end' : 'flex-start'}
//                   maxW={{ base: "85%", md: "70%" }}
//                 >
//                   <HStack spacing={2} align="start">
//                     {message.sender !== 'user' && (
//                       <Avatar size="sm" name={message.sender} />
//                     )}
//                     <Box
//                       bg={message.sender === 'user' ? 'blue.500' : 'gray.100'}
//                       color={message.sender === 'user' ? 'white' : 'black'}
//                       p={3}
//                       borderRadius="lg"
//                       shadow="sm"
//                     >
//                       <Text>{message.content}</Text>
//                     </Box>
//                   </HStack>
//                 </MotionBox>
//               ))}
//               <div ref={messagesEndRef} />
//             </VStack>

//             <HStack mt={4} spacing={3}>
//               <Input
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 placeholder="Type your message..."
//                 onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//                 disabled={isLoading}
//                 size="lg"
//                 borderRadius="lg"
//               />
//               <Button 
//                 colorScheme="blue"
//                 onClick={handleSend}
//                 isLoading={isLoading}
//                 size="lg"
//                 borderRadius="lg"
//               >
//                 Send
//               </Button>
//             </HStack>
//           </Flex>
//         </Flex>
//       </Flex>
//     </ErrorBoundary>
//   );
// };

// // Add Error Boundary component
// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error('ChatInterface Error:', error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return this.props.fallback;
//     }
//     return this.props.children;
//   }
// }

// export default ChatInterface;


import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  Avatar,
  IconButton,
  useColorModeValue,
  useBreakpointValue,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerBody,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, HamburgerIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { chatAPI } from '../services/api';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MotionBox = motion(Box);

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedAI, setSelectedAI] = useState('assistant');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      content: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage(input, selectedAI);

      const aiMessage = {
        content: response || 'No response received',
        sender: selectedAI,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = {
        content: 'Sorry, I encountered an error processing your request.',
        sender: selectedAI,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const Sidebar = () => (
    <VStack spacing={4} align="stretch" w="full" p={4}>
      <Text fontSize="lg" fontWeight="bold">AI Models</Text>
      {['assistant', 'creative', 'technical', 'friendly'].map((ai) => (
        <Button
          key={ai}
          variant={selectedAI === ai ? 'solid' : 'ghost'}
          onClick={() => {
            setSelectedAI(ai);
            if (isMobile) onClose();
          }}
          colorScheme="blue"
          w="full"
          justifyContent="flex-start"
          px={4}
        >
          {ai.charAt(0).toUpperCase() + ai.slice(1)}
        </Button>
      ))}
    </VStack>
  );

  return (
    <ErrorBoundary fallback={<Text p={4}>Something went wrong. Please try again.</Text>}>
      <Flex h="100vh" direction="column">
        <Box p={4} borderBottom="1px" borderColor={borderColor}>
          <HStack justify="space-between">
            <HStack spacing={4}>
              <IconButton
                icon={<HamburgerIcon />}
                onClick={isMobile ? onOpen : toggleSidebar}
                variant="ghost"
                aria-label="Toggle Sidebar"
              />
              
              <Text fontSize="xl" fontWeight="bold">Billi</Text>
            </HStack>
          </HStack>
        </Box>

        <Flex flex={1} overflow="hidden">
          {!isMobile && (
            <Box
              w="240px"
              borderRight="1px"
              borderColor={borderColor}
              display={isSidebarOpen ? 'block' : 'none'}
              transition="all 0.3s"
            >
              <Sidebar />
            </Box>
          )}

          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerBody p={0}>
                <Sidebar />
              </DrawerBody>
            </DrawerContent>
          </Drawer>

          <Flex flex={1} direction="column" bg={bgColor} p={4}>
            <VStack flex={1} overflow="auto" spacing={4} align="stretch">
              {messages.map((message, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  alignSelf={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                  maxW={{ base: "85%", md: "70%" }}
                >
                  <HStack spacing={2} align="start">
                    {message.sender !== 'user' && (
                      <Avatar size="sm" name={message.sender} />
                    )}
                    <Box
                      bg={message.sender === 'user' ? 'blue.500' : 'gray.100'}
                      color={message.sender === 'user' ? 'white' : 'black'}
                      p={3}
                      borderRadius="lg"
                      shadow="sm"
                      whiteSpace="pre-wrap"
                    >
                      <ReactMarkdown
                        children={message.content}
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      />
                    </Box>
                  </HStack>
                </MotionBox>
              ))}
              <div ref={messagesEndRef} />
            </VStack>

            <HStack mt={4} spacing={3}>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
                size="lg"
                borderRadius="lg"
              />
              <Button 
                colorScheme="blue"
                onClick={handleSend}
                isLoading={isLoading}
                size="lg"
                borderRadius="lg"
              >
                Send
              </Button>
            </HStack>
          </Flex>
        </Flex>
      </Flex>
    </ErrorBoundary>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ChatInterface Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default ChatInterface;
