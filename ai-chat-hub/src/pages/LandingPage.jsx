import React, { useState, useEffect } from 'react';
import profilePic from '../images/profile.jpg';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Grid,
  useColorModeValue,
  Icon,
  Flex,
  Spinner,
  Avatar,
  Link,
  Image,
  useColorMode,
  IconButton,
  Input,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { 
  BiBrain,
  BiConversation,
  BiAnalyse,
  BiRocket,
} from 'react-icons/bi';
import { RiRobot2Line, RiMessage3Line, RiSendPlaneFill } from 'react-icons/ri';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const features = [
  { icon: BiConversation, title: 'Natural Conversations', description: 'Chat naturally with advanced language understanding' },
  { icon: BiBrain, title: 'Smart Learning', description: 'Adapts to your style and preferences' },
  { icon: BiAnalyse, title: 'Quick Insights', description: 'Process and analyze complex information' },
  { icon: BiRocket, title: 'Task Automation', description: 'Automate your daily workflows' },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Product Manager',
    content: 'Billi has transformed how I organize my daily tasks.',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'Mike Chen',
    role: 'Developer',
    content: 'The most intuitive AI assistant I\'ve ever used.',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
];

const BilliBot = () => (
  <MotionBox
    animate={{ 
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0]
    }}
    transition={{ 
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    w="200px"
    h="200px"
    position="relative"
  >
    <Icon
      as={RiRobot2Line}
      w="100%"
      h="100%"
      color="billi.500"
      filter="drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.1))"
    />
  </MotionBox>
);

const ChatPreview = () => {
  const messages = [
    { text: "Hi! I'm Billi, your AI companion.", sender: 'bot' },
    { text: "How can you help me?", sender: 'user' },
    { text: "I can assist with tasks, answer questions, and much more!", sender: 'bot' }
  ];

  return (
    <VStack
      spacing={4}
      p={6}
      bg={useColorModeValue('white', 'gray.800')}
      borderRadius="xl"
      boxShadow="xl"
      w="full"
      maxW="600px"
      position="relative"
      overflow="hidden"
      border="1px solid"
      borderColor={useColorModeValue('gray.100', 'gray.700')}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: useColorModeValue(
          "linear-gradient(145deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)",
          "linear-gradient(145deg, rgba(45,55,72,0.4) 0%, rgba(45,55,72,0) 100%)"
        ),
        zIndex: 0,
      }}
    >
      <AnimatePresence>
        {messages.map((msg, index) => (
          <MotionBox
            key={index}
            initial={{ opacity: 0, x: msg.sender === 'bot' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.5 }}
            alignSelf={msg.sender === 'bot' ? 'flex-start' : 'flex-end'}
            bg={msg.sender === 'bot' 
              ? useColorModeValue('billi.50', 'gray.700')
              : useColorModeValue('billi.500', 'billi.400')
            }
            color={msg.sender === 'bot' 
              ? useColorModeValue('gray.800', 'gray.100')
              : 'white'
            }
            px={4}
            py={2}
            borderRadius="lg"
            maxW="80%"
            boxShadow="sm"
          >
            <Text>{msg.text}</Text>
          </MotionBox>
        ))}
      </AnimatePresence>
    </VStack>
  );
};

const LandingPage = () => {
  // State hooks
  const [isLoading, setIsLoading] = useState(true);

  // Context hooks
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  // Effects
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  if (isLoading) {
    return (
      <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="purple.500" />
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" overflow="hidden">
      <Container maxW="container.xl" pt={20}>
        <Box position="absolute" top={4} right={4}>
          <HStack spacing={4}>
            <Button
              variant="ghost"
              onClick={() => navigate('/about')}
              leftIcon={<BiRocket />}
              _hover={{
                bg: useColorModeValue('blue.100', 'blue.700'),
                transform: 'scale(1.05)'
              }}
              transition="all 0.2s"
            >
              About
            </Button>
            <IconButton
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              aria-label="Toggle Theme"
              size="lg"
              _hover={{
                bg: useColorModeValue('blue.100', 'blue.700'),
                transform: 'scale(1.05)'
              }}
              transition="all 0.2s"
            />
          </HStack>
        </Box>
        <VStack spacing={20} align="center">
          {/* Hero Section with Bot Animation */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            textAlign="center"
          >
            <BilliBot />
            <Heading
              size="2xl"
              bgGradient="linear(to-r, billi.500, accent.500)"
              bgClip="text"
              letterSpacing="tight"
              mb={6}
              pb={2}
              lineHeight="1.2"
            >
              Meet Billi — Your Everyday AI Companion
            </Heading>
            <Text fontSize="xl" color={textColor} maxW="800px" mx="auto">
              Your intelligent companion for conversations, tasks, and creative exploration.
              Powered by advanced AI to make your life simpler and more productive.
            </Text>
          </MotionBox>

          {/* Call to Action */}
          <VStack spacing={4}>
            <MotionBox
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                colorScheme="blue"
                bgGradient="linear(to-r, billi.500, accent.500)"
                color="white"
                leftIcon={<RiMessage3Line />}
                onClick={() => navigate('/chat')}
                _hover={{
                  bgGradient: "linear(to-r, billi.600, accent.600)",
                }}
              >
                Start Chatting with Billi
              </Button>
            </MotionBox>
          </VStack>

          {/* Features Section */}
          <Grid 
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} 
            gap={8} 
            w="full"
          >
            {features.map((feature, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                variant="glass"
                p={8}
                borderRadius="xl"
                textAlign="center"
              >
                <Icon as={feature.icon} w={12} h={12} color="billi.500" mb={4} />
                <Heading size="md" mb={4}>{feature.title}</Heading>
                <Text color={textColor}>{feature.description}</Text>
              </MotionBox>
            ))}
          </Grid>


          

          {/* Chat Preview Section */}
          <MotionBox
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            w="full"
            display="flex"
            justifyContent="center"
          >
            <ChatPreview />
          </MotionBox>

          
          

          {/* Footer */}
          <Box
            as="footer"
            w="full"
            py={16}
            borderTop="1px"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            bg="transparent"
            position="relative"
            mt={12}
          >
            <Container 
              maxW="100vw"
              px={0}
              mx={0}
            >
              <Grid
                templateColumns={{
                  base: '1fr',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                }}
                gap={12}
              >
                {/* Company Info */}
                <VStack align="start" spacing={6}>
                  <MotionBox
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Heading
                      size="md"
                      bgGradient="linear(to-r, billi.500, billi.400)"
                      bgClip="text"
                      letterSpacing="tight"
                    >
                      Billi AI
                    </Heading>
                  </MotionBox>
                  <Text 
                    fontSize="sm" 
                    color={useColorModeValue('gray.600', 'gray.400')}
                    lineHeight="tall"
                    maxW="300px"
                  >
                    Empowering conversations through artificial intelligence. Making technology more human, one chat at a time.
                  </Text>
                </VStack>

                {/* Quick Links */}
                <VStack align="start" spacing={6}>
                  <Heading 
                    size="sm" 
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    Quick Links
                  </Heading>
                  <VStack align="start" spacing={2}>
                    {[
                      { name: 'About', href: '/about' },
                      { name: 'Features', href: '#features' },
                      { name: 'Pricing', href: '#pricing' },
                      { name: 'Blog', href: '#blog' },
                      { name: 'Contact', href: '#contact' }
                    ].map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        fontSize="sm"
                        color={useColorModeValue('gray.600', 'gray.400')}
                        _hover={{
                          color: 'billi.500',
                          transform: 'translateX(4px)',
                        }}
                        transition="all 0.3s ease"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </VStack>
                </VStack>

                {/* Contact */}
                <VStack align="start" spacing={4}>
                  <Heading size="sm">Connect</Heading>
                  <HStack spacing={4}>
                    {[
                      { icon: FaGithub, href: 'https://github.com/iamratinder' },
                      { icon: FaTwitter, href: 'https://twitter.com/Ratinder_999' },
                      { icon: FaLinkedin, href: 'https://linkedin.com/in/ratinderdeepsingh' },
                    ].map((social, index) => (
                      <MotionBox
                        key={index}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Link href={social.href} isExternal>
                          <Icon
                            as={social.icon}
                            w={5}
                            h={5}
                            color={useColorModeValue('gray.600', 'gray.400')}
                            _hover={{ color: 'billi.500' }}
                            transition="all 0.3s ease"
                          />
                        </Link>
                      </MotionBox>
                    ))}
                  </HStack>
                  <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                    Email: hello@billiai.com
                  </Text>
                </VStack>
              </Grid>

              {/* Bottom Bar */}
              <MotionBox
                borderTop="1px"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                mt={8}
                pt={8}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  justify="space-between"
                  align="center"
                  gap={4}
                >
                  <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                    © 2025 Billi AI. Created with ❤️ by Ratinderdeep Singh
                  </Text>
                  <HStack spacing={6} fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                    <Link href="#" _hover={{ color: 'billi.500' }}>Privacy Policy</Link>
                    <Link href="#" _hover={{ color: 'billi.500' }}>Terms of Service</Link>
                    <Link href="#" _hover={{ color: 'billi.500' }}>Cookie Policy</Link>
                  </HStack>
                </Flex>
              </MotionBox>
            </Container>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default LandingPage;
