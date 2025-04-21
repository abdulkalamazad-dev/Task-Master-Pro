import { Box } from '@chakra-ui/react';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout({ children }) {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box flex="1" p={4} maxW="1200px" mx="auto" w="100%">
        {children}
      </Box>
      <Footer />
    </Box>
  );
}

export default Layout;
