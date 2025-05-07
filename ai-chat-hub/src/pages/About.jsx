import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Avatar,
  Icon,
  Grid,
  Link,
  HStack,
  useColorModeValue,
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { SunIcon, MoonIcon, ArrowBackIcon } from '@chakra-ui/icons';
import profilePic from '../images/profile.jpg';

const MotionBox = motion(Box);
const MotionGrid = motion(Grid);

const About = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box 
      bg={bgColor} 
      minH="100vh"
      bgGradient={useColorModeValue(
        'linear(to-br, gray.50, blue.50)',
        'linear(to-br, gray.900, blue.900)'
      )}
    >
      <IconButton
        icon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        variant="ghost"
        aria-label="Go Back"
        position="fixed"
        top={4}
        left={4}
        _hover={{
          bg: useColorModeValue('blue.100', 'blue.700'),
          transform: 'scale(1.05)'
        }}
        transition="all 0.2s"
      />
      <IconButton
        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        position="fixed"
        top={4}
        right={4}
        variant="ghost"
        aria-label="Toggle Theme"
        _hover={{
          bg: useColorModeValue('blue.100', 'blue.700'),
          transform: 'scale(1.05)'
        }}
      />
      <Container maxW="container.xl" py={20}>
        <VStack spacing={16}>
          {/* Personal Section */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            textAlign="center"
            maxW="800px"
            p={8}
            bg={cardBg}
            borderRadius="2xl"
            boxShadow="xl"
            _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Avatar 
                size="2xl" 
                name="Ratinderdeep Singh"
                src={profilePic}
                mb={6}
                border="4px solid"
                borderColor="blue.400"
              />
            </motion.div>
            <Heading 
              size="lg" 
              mb={4}
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
            >
              Crafted by Ratinderdeep Singh
            </Heading>
            <Text fontSize="lg" mb={6} color={textColor}>
              "Building Billi has been a journey of combining cutting-edge AI technology
              with human-centered design to create something truly meaningful."
            </Text>
            <Text fontSize='larger' mb={6} color={textColor}>
              It's just the beggining - there’s much more to come.
            </Text>
          </MotionBox>

          {/* Project Description */}
          <VStack spacing={8} align="start" w="full">
            <Heading 
              size="xl"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
            >
              About Billi AI
            </Heading>
            <Text 
              fontSize="lg" 
              color={textColor}
              p={6}
              bg={cardBg}
              borderRadius="xl"
              boxShadow="md"
              _hover={{ boxShadow: 'lg' }}
              transition="all 0.3s"
            >
              Billi AI is a state-of-the-art conversational AI platform designed to make artificial intelligence 
              more accessible and useful for everyday tasks. Built with React and powered by advanced language 
              models, Billi represents the intersection of user-friendly design and powerful AI capabilities.
            </Text>
            
            <MotionGrid 
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} 
              gap={8} 
              w="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {['Technology Stack', 'Features'].map((title, index) => (
                <MotionBox
                  key={title}
                  p={6}
                  bg={cardBg}
                  borderRadius="xl"
                  boxShadow="md"
                  _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
                  transition="all 0.3s"
                  initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Heading 
                    size="md" 
                    mb={4}
                    bgGradient="linear(to-r, blue.400, purple.500)"
                    bgClip="text"
                  >
                    {title}
                  </Heading>
                  <VStack align="start" spacing={2}>
                    {title === 'Technology Stack' ? (
                      ['React & Vite', 'Chakra UI', 'Framer Motion', 'Advanced AI Models']
                    ) : (
                      ['Natural Language Processing', 'Real-time Conversations', 'Code Highlighting', 'Dark/Light Mode']
                    ).map(item => (
                      <Text 
                        key={item} 
                        color={textColor}
                        _hover={{ color: 'blue.400', transform: 'translateX(5px)' }}
                        transition="all 0.2s"
                      >
                        • {item}
                      </Text>
                    ))}
                  </VStack>
                </MotionBox>
              ))}
            </MotionGrid>
          </VStack>

          {/* Connect Section */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            p={8}
            bg={cardBg}
            borderRadius="xl"
            boxShadow="md"
            _hover={{ boxShadow: 'lg' }}
          >
            <VStack spacing={4}>
              <Heading 
                size="md"
                bgGradient="linear(to-r, blue.400, purple.500)"
                bgClip="text"
              >
                Connect with the Developer
              </Heading>
              <HStack spacing={6}>
                {[
                  { icon: FaGithub, href: "https://github.com/iamratinder" },
                  { icon: FaTwitter, href: "https://twitter.com/Ratinder_999" },
                  { icon: FaLinkedin, href: "https://linkedin.com/in/ratinderdeepsingh" }
                ].map((social, index) => (
                  <motion.div
                    key={social.href}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Link href={social.href} isExternal>
                      <Icon 
                        as={social.icon} 
                        w={6} 
                        h={6} 
                        color="blue.400"
                        _hover={{ color: 'purple.500' }}
                        transition="all 0.3s"
                      />
                    </Link>
                  </motion.div>
                ))}
              </HStack>
            </VStack>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default About;
