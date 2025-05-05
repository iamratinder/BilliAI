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
  { icon: BiAnalyse, title: 'Data Analysis', description: 'Process and analyze complex information' },
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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
            >
              Meet Billi — Your Everyday AI Companion
            </Heading>
            <Text fontSize="xl" color={textColor} maxW="800px" mx="auto">
              Your intelligent companion for conversations, tasks, and creative exploration.
              Powered by advanced AI to make your life simpler and more productive.
            </Text>
          </MotionBox>

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

          {/* Personal Touch Section */}
          <MotionBox
            variant="glass"
            p={12}
            borderRadius="2xl"
            textAlign="center"
            maxW="800px"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Avatar 
              size="2xl" 
              name="Ratinderdeep Singh"
              src={profilePic}
              mb={6}
            />
            <Heading size="lg" mb={4}>Crafted by Ratinderdeep Singh</Heading>
            <Text fontSize="lg" mb={6}>
              "Building Billi has been a journey of combining cutting-edge AI technology
              with human-centered design to create something truly meaningful."
            </Text>
          </MotionBox>

          {/* Call to Action */}
          <HStack spacing={4}>
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
            
            {/* <MotionBox
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                borderWidth="2px"
                borderColor={useColorModeValue('billi.500', 'billi.400')}
                color={useColorModeValue('billi.500', 'billi.400')}
                _hover={{
                  bg: useColorModeValue('billi.50', 'rgba(49, 130, 206, 0.1)')
                }}
                leftIcon={<BiRocket />}
              >
                About Billi
              </Button>
            </MotionBox> */}
          </HStack>

          {/* Testimonials Section */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={8} w="full">
            {testimonials.map((testimonial, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 * index }}
                variant="glass"
                p={6}
                borderRadius="xl"
              >
                <HStack spacing={4} mb={4}>
                  <Avatar src={testimonial.avatar} name={testimonial.name} />
                  <Box>
                    <Text fontWeight="bold">{testimonial.name}</Text>
                    <Text fontSize="sm" color="gray.500">{testimonial.role}</Text>
                  </Box>
                </HStack>
                <Text>{testimonial.content}</Text>
              </MotionBox>
            ))}
          </Grid>

          {/* Footer */}
          <Box as="footer" w="full" py={10}>
            <VStack spacing={4}>
              <HStack spacing={6}>
                <Link href="https://github.com/iamratinder" isExternal>
                  <Icon as={FaGithub} w={6} h={6} />
                </Link>
                <Link href="https://twitter.com/Ratinder_999" isExternal>
                  <Icon as={FaTwitter} w={6} h={6} />
                </Link>
                <Link href="https://linkedin.com/in/ratinderdeepsingh" isExternal>
                  <Icon as={FaLinkedin} w={6} h={6} />
                </Link>
              </HStack>
              <Text fontSize="sm" color="gray.500">
                © 2025 Billi AI Assistant. Created with ❤️ by Ratinderdeep Singh
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default LandingPage;
