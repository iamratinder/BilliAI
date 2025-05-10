import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
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
  Spinner,
  Textarea,
  useToast,
  Image,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, HamburgerIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { chatAPI } from '../services/api';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import logo from '../assets/Billi_logo_light.png';

const MotionBox = motion(Box);

const AI_PERSONALITIES = {
  assistant: {
    name: 'Assistant',
    color: 'blue'
  },
  creative: {
    name: 'Creative',
    color: 'purple'
  },
  technical: {
    name: 'Technical',
    color: 'green'
  },
  friendly: {
    name: 'Friendly',
    color: 'orange'
  }
};

const Sidebar = ({ selectedAI, setSelectedAI, isMobile, onClose, borderColor }) => {
  const useColorValue = useColorModeValue('white', 'gray.800');
  
  return (
    <VStack spacing={4} align="stretch" w="full" p={4} bg={useColorValue}>
      {Object.entries(AI_PERSONALITIES).map(([aiType, aiInfo]) => (
        <Button
          key={aiType}
          variant={selectedAI === aiType ? 'solid' : 'ghost'}
          onClick={() => {
            setSelectedAI(aiType);
            if (isMobile) onClose();
          }}
          colorScheme={aiInfo.color}
          w="full"
          justifyContent="flex-start"
          px={4}
          bg={selectedAI === aiType 
            ? useColorModeValue(`${aiInfo.color}.500`, `${aiInfo.color}.200`)
            : 'transparent'
          }
          color={selectedAI === aiType 
            ? useColorModeValue('white', 'gray.800')
            : useColorModeValue('gray.800', 'white')
          }
          _hover={{
            bg: useColorModeValue(
              selectedAI === aiType ? `${aiInfo.color}.600` : `${aiInfo.color}.50`,
              selectedAI === aiType ? `${aiInfo.color}.300` : `${aiInfo.color}.700`
            )
          }}
        >
          <VStack align="start" spacing={0}>
            <Text>{aiInfo.name}</Text>
            <Text fontSize="xs" opacity={0.8}>{aiInfo.description}</Text>
          </VStack>
        </Button>
      ))}
    </VStack>
  );
};

const BilliLogo = ({ navigate }) => (
  <HStack
    as="button"
    onClick={() => navigate('/')}
    spacing={2}
    _hover={{
      transform: 'scale(1.05)',
    }}
    transition="all 0.3s ease"
  >
    <Text
      fontSize="3xl"
      fontWeight="700"
      // bgGradient="linear(to-r, blue.400, teal.400)"
      bgColor={'billi.500'}
      bgClip="text"
    >
      Billi
    </Text>
  </HStack>
);

const bounceVariant = {
  animate: (i) => ({
    y: [0, -6, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
      delay: i * 0.2, // This creates the wave
    },
  }),
};

const TypingIndicator = () => {
  return (
    <HStack spacing={2}>
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          as={motion.div}
          variants={bounceVariant}
          animate="animate"
          custom={index}
          h="6px"
          w="6px"
          borderRadius="full"
          bg="blue.500"
        />
      ))}
    </HStack>
  );
};

const MessageContent = ({ content }) => {
  return (
    <ReactMarkdown
      children={content}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <Box my={2} borderRadius="md" overflow="hidden">
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  borderRadius: '0.375rem',
                }}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </Box>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        p: ({ children }) => (
          <Text mb={2} lineHeight="base">
            {children}
          </Text>
        ),
        ul: ({ children }) => (
          <VStack align="start" spacing={0.5} my={2} pl={4}>
            {children}
          </VStack>
        ),
        li: ({ children }) => (
          <HStack align="start" spacing={1}>
            <Text as="span" mt={1}>•</Text>
            <Text>{children}</Text>
          </HStack>
        ),
      }}
    />
  );
};

// Add this custom hook after the imports and before components
const useAutoHeightTextarea = () => {
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const scrollPos = window.scrollY;
      // Reset height to initial value if content is empty
      if (!textarea.value.trim()) {
        textarea.style.height = '50px';
      } else {
        textarea.style.height = '50px';
        const scrollHeight = textarea.scrollHeight;
        textarea.style.height = `${Math.min(Math.max(scrollHeight, 50), 200)}px`;
      }
      window.scrollTo(0, scrollPos);
    }
  };

  const resetHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '50px'; // Changed from 60px
    }
  };

  return [textareaRef, adjustHeight, resetHeight];
};

// Add these constants before the ChatInterface component
const RATE_LIMIT_MS = 2000; // 2 seconds between messages
const MAX_MESSAGES_PER_MINUTE = 20;
const MAX_MESSAGES_PER_DAY = 900;
const MESSAGE_HISTORY_WINDOW = 60000; // 1 minute in milliseconds

const WelcomeMessage = () => {
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const bgGradient = useColorModeValue(
    'linear(to-t, blue.500, blue.400, teal.200)',
    // 'linear(to-r, blue.400, teal.400)',
    'linear(to-r, blue.200, teal.200)'
  );
  
  const features = [
    { icon: '📝', title: 'Assistant', desc: 'Smart AI Chat' },
    { icon: '⚡', title: 'Real-time', desc: 'Quick Replies' },
    { icon: '🎯', title: 'Precise', desc: 'Clear Results' },
    { icon: '🔐', title: 'Private', desc: 'Secure Chat' }
  ];

  return (
    <VStack
      spacing={6}
      justify="center"
      align="center"
      height="100%"
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        <Box
          p={2}
          borderRadius="full"
          borderWidth={2}
          borderColor={useColorModeValue('white', 'white')}
          bg={useColorModeValue('blue.500', 'blue.400')}
          position="relative"
          _after={{
            content: '""',
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            filter: 'blur(15px)',
            opacity: 0.3,
            borderRadius: 'full',
            zIndex: -1
          }}
        >
          <Image
            src={logo}
            alt="Billi Logo"
            boxSize="80px"
            objectFit="contain"
            transform="scale(1.2)"
            opacity={1}
            _hover={{
              transform: "scale(1.3)",
              opacity: 1
            }}
            transition="all 0.3s ease"
          />
        </Box>
      </motion.div>

      <VStack spacing={1}>
        <Text
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="bold"
          bgGradient={bgGradient}
          bgClip="text"
          textAlign="center"
        >
          Welcome to BilliAI
        </Text>
        <Text
          color={textColor}
          textAlign="center"
          maxW="md"
          fontSize="lg"
        >
          Your intelligent conversation partner
        </Text>
      </VStack>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <HStack 
          spacing={{ base: 4, md: 6 }} 
          flexWrap="wrap" 
          justify="center"
          maxW="2xl"
          py={4}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <VStack
                p={3}
                bg={useColorModeValue('white', 'gray.700')}
                borderRadius="xl"
                shadow="lg"
                w="120px"
                h="120px"
                justify="center"
                spacing={2}
                cursor="pointer"
                _hover={{
                  shadow: 'xl',
                  transform: 'translateY(-2px)'
                }}
                transition="all 0.2s"
              >
                <Text fontSize="2xl">{feature.icon}</Text>
                <Text fontWeight="bold" fontSize="sm">{feature.title}</Text>
                <Text fontSize="xs" color={textColor} textAlign="center" noOfLines={1}>
                  {feature.desc}
                </Text>
              </VStack>
            </motion.div>
          ))}
        </HStack>
      </motion.div>

      <Text
        color={textColor}
        fontSize="sm"
        opacity={0.8}
        as={motion.p}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.8 }}
      >
        Type a message below to get started
      </Text>
    </VStack>
  );
};

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
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [textareaRef, adjustHeight, resetHeight] = useAutoHeightTextarea();

  const [lastMessageTime, setLastMessageTime] = useState(0);
  const [messageHistory, setMessageHistory] = useState([]);

  // Add this effect to clean up old message history
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setMessageHistory(prev => prev.filter(time => now - time < MESSAGE_HISTORY_WINDOW));
    }, MESSAGE_HISTORY_WINDOW);
    
    return () => clearInterval(cleanup);
  }, []);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const now = Date.now();
    
    // Check rate limit
    if (now - lastMessageTime < RATE_LIMIT_MS) {
      toast({
        title: "Please wait",
        description: `You can send another message in ${Math.ceil((RATE_LIMIT_MS - (now - lastMessageTime)) / 1000)} seconds`,
        status: "warning",
        duration: 2000
      });
      return;
    }

    // Check messages per minute limit
    const messagesLastMinute = messageHistory.filter(time => now - time < MESSAGE_HISTORY_WINDOW).length;
    if (messagesLastMinute >= MAX_MESSAGES_PER_MINUTE) {
      toast({
        title: "Rate limit exceeded",
        description: "You've reached the maximum messages per minute limit. Please wait.",
        status: "error",
        duration: 3000
      });
      return;
    }

    // Check messages per day limit
    const today = new Date().toDateString();
    const dailyMessageCount = parseInt(localStorage.getItem(`messageCount_${today}`) || '0');
    if (dailyMessageCount >= MAX_MESSAGES_PER_DAY) {
      toast({
        title: "Daily limit exceeded",
        description: "You've reached the maximum messages per day limit.",
        status: "error",
        duration: 3000
      });
      return;
    }

    setLastMessageTime(now);
    setMessageHistory(prev => [...prev, now]);
    localStorage.setItem(`messageCount_${today}`, (dailyMessageCount + 1).toString());

    const userMessage = {
      content: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    resetHeight(); // Reset textarea height after sending

    try {
      setIsLoading(true);
      const response = await chatAPI.sendMessage(input, selectedAI);

      const aiMessage = {
        content: response || 'No response received',
        sender: selectedAI,
        timestamp: new Date().toISOString(),
        personality: AI_PERSONALITIES[selectedAI]
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
              <BilliLogo navigate={navigate} />
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
              as={motion.div}
              initial={{ width: "0px" }}
              animate={{ 
                width: isSidebarOpen ? "240px" : "0px",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              borderRight="1px"
              borderColor={borderColor}
              overflow="hidden"
              bg={useColorModeValue('white', 'gray.800')}
            >
              <Sidebar 
                selectedAI={selectedAI} 
                setSelectedAI={setSelectedAI} 
                isMobile={isMobile} 
                onClose={onClose} 
                borderColor={borderColor} 
              />
            </Box>
          )}

          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent bg={useColorModeValue('white', 'gray.800')}>
              <DrawerBody p={0}>
                <HStack p={4} borderBottomWidth="1px" borderColor={borderColor}>
                  <IconButton
                    icon={<ChevronLeftIcon />}
                    onClick={onClose}
                    variant="ghost"
                    aria-label="Close Sidebar"
                    _hover={{
                      bg: useColorModeValue('blue.100', 'blue.700'),
                      transform: 'scale(1.05)'
                    }}
                    transition="all 0.2s"
                  />
                </HStack>
                <Sidebar 
                  selectedAI={selectedAI} 
                  setSelectedAI={setSelectedAI} 
                  isMobile={isMobile} 
                  onClose={onClose} 
                  borderColor={borderColor} 
                />
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
              {messages.length === 0 ? (
                <WelcomeMessage />
              ) : (
                <>
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
                          <Image
                            src={logo}
                            alt="Billi Logo"
                            boxSize="35px"  // adjusted size
                            objectFit="contain"
                            borderRadius="full"
                          />
                        )}
                        <Box
                          bg={message.sender === 'user' ? 'blue.500' : useColorModeValue('white', 'gray.700')}
                          color={message.sender === 'user' ? 'white' : useColorModeValue('gray.800', 'white')}
                          px={3}
                          py={2}
                          borderRadius="lg"
                          shadow="lg"
                          whiteSpace="pre-wrap"
                          maxW="100%"
                          sx={{
                            '& pre': {
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word'
                            },
                            '& p': {
                              wordBreak: 'break-word'
                            }
                          }}
                          _hover={{
                            shadow: 'xl',
                            transform: 'translateY(-1px)'
                          }}
                          transition="all 0.2s"
                        >
                          <MessageContent content={message.content} />
                        </Box>
                      </HStack>
                    </MotionBox>
                  ))}
                </>
              )}
              {isLoading && (
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  alignSelf="flex-start"
                  maxW={{ base: "85%", md: "70%" }}
                >
                  <HStack spacing={2} align="start">
                    <Image
                      src={logo}
                      alt="Billi Logo"
                      boxSize="35px"
                      objectFit="contain"
                      borderRadius="full"
                    />
                    <Box
                      bg={useColorModeValue('white', 'gray.700')}
                      px={4}
                      py={3}
                      borderRadius="lg"
                      shadow="lg"
                    >
                      <TypingIndicator />
                    </Box>
                  </HStack>
                </MotionBox>
              )}
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
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  adjustHeight();
                }}
                placeholder="Type your message..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                size="lg"
                borderRadius="lg"
                _focus={{
                  borderColor: 'blue.400',
                  boxShadow: '0 0 0 1px blue.400'
                }}
                bg={useColorModeValue('white', 'gray.700')}
                minH="50px" 
                maxH="200px"
                h="50px"
                resize="none"
                overflowY="auto"
                style={{ transition: 'height 0.1s ease-out' }}
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
