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
  useColorMode,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, HamburgerIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';
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
  const { colorMode, toggleColorMode } = useColorMode();

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

  const BilliLogo = () => (
    <Text
      as="button"
      fontSize="2xl"
      fontWeight="900"
      bgGradient="linear(to-r, blue.400, teal.400)"
      bgClip="text"
      onClick={() => navigate('/')}
      _hover={{
        transform: 'scale(1.05)',
        textShadow: '0 0 20px rgba(66, 153, 225, 0.3)'
      }}
      transition="all 0.3s ease"
      display="flex"
      alignItems="center"
    >
      Bi//i
    </Text>
  );

  const Sidebar = () => (
    <VStack 
      spacing={4} 
      align="stretch" 
      w="full" 
      p={4}
      bg={useColorModeValue('white', 'gray.800')}
      borderColor={borderColor}
    >
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
          bg={selectedAI === ai 
            ? useColorModeValue('blue.500', 'blue.200')
            : 'transparent'
          }
          color={selectedAI === ai 
            ? useColorModeValue('white', 'gray.800')
            : useColorModeValue('gray.800', 'white')
          }
          _hover={{
            bg: useColorModeValue(
              selectedAI === ai ? 'blue.600' : 'blue.50',
              selectedAI === ai ? 'blue.300' : 'blue.700'
            )
          }}
        >
          {ai.charAt(0).toUpperCase() + ai.slice(1)}
        </Button>
      ))}
    </VStack>
  );

  return (
    <ErrorBoundary fallback={<Text p={4}>Something went wrong. Please try again.</Text>}>
      <Flex h="100vh" direction="column">
        <Box 
          p={4} 
          borderBottom="1px" 
          borderColor={borderColor}
          backdropFilter="blur(10px)"
          bg={useColorModeValue(
            'linear-gradient(to right, rgba(255,255,255,0.95), rgba(237,242,247,0.95))',
            'linear-gradient(to right, rgba(26,32,44,0.95), rgba(45,55,72,0.95))'
          )}
          position="sticky"
          top={0}
          zIndex={1}
          boxShadow="sm"
        >
          <HStack justify="space-between">
            <HStack spacing={4}>
              <IconButton
                icon={<HamburgerIcon />}
                onClick={isMobile ? onOpen : toggleSidebar}
                variant="ghost"
                aria-label="Toggle Sidebar"
                _hover={{
                  bg: useColorModeValue('blue.100', 'blue.700'),
                  transform: 'scale(1.05)'
                }}
                transition="all 0.2s"
              />
              <BilliLogo />
            </HStack>
            <IconButton
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              aria-label="Toggle Theme"
              _hover={{
                bg: useColorModeValue('blue.100', 'blue.700'),
                transform: 'scale(1.05)'
              }}
              transition="all 0.2s"
            />
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
              bg={useColorModeValue('white', 'gray.800')}
              shadow="md"
            >
              <Sidebar />
            </Box>
          )}

          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent bg={useColorModeValue('white', 'gray.800')}>
              <DrawerBody p={0}>
                <Sidebar />
              </DrawerBody>
            </DrawerContent>
          </Drawer>

          <Flex 
            flex={1} 
            direction="column" 
            bg={useColorModeValue('gray.50', 'gray.900')} 
            p={4}
            position="relative"
          >
            <VStack flex={1} overflow="auto" spacing={4} align="stretch">
              {messages.map((message, index) => (
                <MotionBox
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  alignSelf={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                  maxW={{ base: "85%", md: "70%" }}
                  whileHover={{ scale: 1.01 }}
                >
                  <HStack spacing={2} align="start">
                    {message.sender !== 'user' && (
                      <Avatar 
                        size="sm" 
                        name={message.sender}
                        bg="blue.500"
                        color="white"
                      />
                    )}
                    <Box
                      bg={message.sender === 'user' ? 'blue.500' : useColorModeValue('white', 'gray.700')}
                      color={message.sender === 'user' ? 'white' : useColorModeValue('gray.800', 'white')}
                      p={3}
                      borderRadius="lg"
                      shadow="lg"
                      whiteSpace="pre-wrap"
                      _hover={{
                        shadow: 'xl',
                        transform: 'translateY(-1px)'
                      }}
                      transition="all 0.2s"
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

            <HStack 
              mt={4} 
              spacing={3} 
              position="sticky" 
              bottom={0} 
              bg={useColorModeValue('gray.50', 'gray.900')} 
              p={2}
              borderRadius="lg"
              shadow="lg"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
                size="lg"
                borderRadius="lg"
                _focus={{
                  borderColor: 'blue.400',
                  boxShadow: '0 0 0 1px blue.400'
                }}
                bg={useColorModeValue('white', 'gray.700')}
              />
              <Button 
                colorScheme="blue"
                onClick={handleSend}
                isLoading={isLoading}
                size="lg"
                borderRadius="lg"
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'lg'
                }}
                transition="all 0.2s"
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
