"use client";


import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Button } from "../components/ui/button";
import { Suspense, useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BlogCard } from "../components/ui/blog";
import Navbar from "../components/ui/navbar";
import { useRouter } from 'next/navigation'
import { fetchAllBlogs, Blog } from '@/lib/blogService';
import Footer from "@/components/ui/footer";
// Animated 3D Dragon Model Component
function AnimatedDragon() {
  const dragonRef = useRef(null);
  const { scene } = useGLTF("/dragon.gltf");


  useFrame((state, delta) => {
    if (dragonRef.current) {
      dragonRef.current.rotation.y += delta * 0.5;
    }
  });


  return <primitive ref={dragonRef} object={scene} scale={3} />;
}


// Animation variants for motion components
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};


const popInVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};


// Custom Cursor Component
function BlueCircleCursor() {
  const cursorRef = useRef(null);
  const [position, setPosition] = useState({ x: -100, y: -100 });


  useEffect(() => {
    function moveCursor(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);


  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
    }
  }, [position]);


  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 24,
        height: 24,
        backgroundColor: "rgba(0, 170, 255, 0.7)",
        borderRadius: "50%",
        pointerEvents: "none",
        transform: `translate3d(-50%, -50%, 0)`,
        transition: "background-color 0.3s ease",
        zIndex: 9999,
        mixBlendMode: "difference",
        boxShadow: "0 0 8px rgba(0, 170, 255, 0.8)",
      }}
    />
  );
}


export default function Home() {
  // Intersection Observer for Landing Text Section
  const landingRef = useRef(null);
  const router = useRouter()
  const [landingVisible, setLandingVisible] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function loadBlogs() {
      try {
        setLoading(true);
        console.log('Loading blogs...');
        
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout - check your Firebase connection')), 10000)
        );
        
        const data = await Promise.race([
          fetchAllBlogs(),
          timeoutPromise
        ]) as Blog[];
        
        console.log('Blogs loaded:', data);
        setBlogs(data);
        setError(null);
      } catch (err: any) {
        console.error('Failed to load blogs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadBlogs();
  }, []); 
  useEffect(() => {
    if (!landingRef.current) return;


    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLandingVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );


    observer.observe(landingRef.current);


    return () => observer.disconnect();
  }, []);


  // Intersection Observer for Blog Cards Section
  const blogRef = useRef(null);
  const [blogVisible, setBlogVisible] = useState(false);


  useEffect(() => {
    if (!blogRef.current) return;


    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBlogVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );


    observer.observe(blogRef.current);


    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (blogs.length > 0) {
      setDisplayedPosts(blogs.slice(0, 6));
    }
  }, [blogs]);
  // State for blog posts and load more functionality
  const bl = [
    {
      title: "Next.js 14: What’s New?",
      summary: "Explore the latest features and improvements in Next.js 14, the cutting-edge React framework.",
      date: "2024-06-10",
      category: "Next.js",
    },
    {
      title: "3D Dragons in React Three Fiber",
      summary: "Learn how to integrate animated 3D dragon models into your React apps for stunning UI.",
      date: "2024-05-28",
      category: "React Three Fiber",
    },
    {
      title: "Futuristic UI Animations",
      summary: "Create sleek and smooth UI animations that mesmerize users and enhance user experience.",
      date: "2024-05-20",
      category: "UI/UX",
    },
    {
      title: "Building with Framer Motion",
      summary: "A deep dive into creating expressive animations using Framer Motion in React.",
      date: "2024-04-18",
      category: "Framer Motion",
    },
    {
      title: "10 JavaScript Tricks Every Dev Should Know",
      summary: "Master advanced JavaScript patterns and tips to write cleaner and faster code.",
      date: "2024-07-01",
      category: "JavaScript",
    },
    {
      title: "Deploying Fullstack Apps with Vercel",
      summary: "Step-by-step guide to deploy your Next.js or React apps with backend using Vercel.",
      date: "2024-06-22",
      category: "DevOps",
    },
    {
      title: "Tailwind CSS vs. Styled Components",
      summary: "Compare Tailwind's utility-first approach with the power of Styled Components.",
      date: "2024-07-05",
      category: "Styling",
    },
    {
      title: "Creating Voice UIs with Web Speech API",
      summary: "Build voice-enabled applications using JavaScript and the Web Speech API.",
      date: "2024-07-06",
      category: "Web APIs",
    },
    {
      title: "How to Build a Blog in Next.js",
      summary: "Start-to-finish tutorial on building a complete blog system using Next.js 14 and Markdown.",
      date: "2024-06-30",
      category: "Next.js",
    },
    {
      title: "Intro to LLMs: ChatGPT & Beyond",
      summary: "Understand how large language models like GPT work and how you can integrate them into your apps.",
      date: "2024-07-10",
      category: "AI",
    },
  ];


  const [displayedPosts, setDisplayedPosts] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const postsPerPage = 6;


  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      const nextPosts = blogs.slice(displayedPosts.length, displayedPosts.length + postsPerPage);
      setDisplayedPosts([...displayedPosts, ...nextPosts]);
      setIsLoading(false);
    }, 1000); // Simulate async loading
  };


  return (
    <main className="min-h-screen bg-black text-white font-sans overflow-y-scroll custom-scrollbar relative">
      <BlueCircleCursor />


      {/* Navbar */}
      <Navbar />


      {/* Landing Page Main Section */}
      <section
        ref={landingRef}
        className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start px-10 py-20"
      >
        {/* Left Text & Buttons */}
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate={landingVisible ? "visible" : "hidden"}
        >
          <motion.h2
            className="text-6xl font-bold leading-tight text-white"
            variants={popInVariants}
          >
            Enter the Realm of <span className="text-gray-400">Future</span>
          </motion.h2>


          <motion.p className="text-xl text-gray-400" variants={popInVariants}>
            The slickest tech blog — Next.js, 3D Dragons, smooth UI, and futuristic animations.
          </motion.p>


          <motion.div variants={popInVariants}>
            <Button  variant="default" size="sm" onClick={()=>{router.push('/articles')}} className="bg-white text-black text-lg px-6 py-3 hover:bg-gray-300">
              Explore Blogs
            </Button>
          </motion.div>
        </motion.div>


        {/* Right 3D Canvas */}
        <motion.div
          className="h-[500px] shadow-2xl rounded-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 1, ease: [0.4, 0, 0.2, 1] }}
        >
          <Canvas camera={{ position: [0, 1, 8] }} shadows>
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
            <Suspense fallback={null}>
              <AnimatedDragon />
            </Suspense>
          </Canvas>
        </motion.div>
      </section>


      {/* Blog Cards Section with more padding on top */}
      <section
        ref={blogRef}
        className="px-10 pt-32 pb-20 max-w-7xl mx-auto"
      >
        {/* Cool animated title */}
        <motion.h3
          className="text-4xl align-middle flex text-center md:text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-600 select-none"
          initial={{ opacity: 0, y: 20 }}
          animate={blogVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Latest Tech Chronicles
        </motion.h3>


        {/* Glowing underline bar */}
        <motion.div
          className="w-24 h-1 rounded-full mb-12 bg-blue-500/80 mx-auto md:mx-0"
          initial={{ width: 0 }}
          animate={blogVisible ? { width: 96 } : { width: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />


        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          animate={blogVisible ? "visible" : "hidden"}
        >
          {displayedPosts.map((post, index) => (
            <BlogCard
              key={index}
              title={post.enhanced_title}
              summary={post.summary}
              date={post.date}
              uid={post.id}
            />
          ))}
        </motion.div>


        {/* Load More Button */}
        {displayedPosts.length < blogs.length && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={blogVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.button
              className="relative bg-gradient-to-r bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold text-lg overflow-hidden group"
              onClick={handleLoadMore}
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">
                {isLoading ? "Loading..." : "Load More Chronicles"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            </motion.button>
          </motion.div>
        )}
      </section>


      {/* About Section */}
      <section className="px-10 pt-32 pb-20 max-w-6xl mx-auto text-center">
        <motion.h3
          className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-600 font-orbitron"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Meet the Tech Wielder
        </motion.h3>


        <motion.div
          className="flex flex-col md:flex-row items-center gap-10 justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden transition duration-300 group">
            <img
              src="/profile.png"
              alt="Your Profile"
              className="w-full h-full object-cover border-4  rounded-full group-hover:scale-105 transition-transform"
            />
          </div>


          <div className="max-w-xl text-lg text-gray-300 font-inter text-left">
            <p className="mb-4">
            Hi I am Sarvagya, A future-forward tech enthusiast, full-stack developer, and creative coder blending AI, 3D, and next-gen web experiences. Whether I'm building React-powered dragons or training neural networks to detect diseases, I code with a purpose: to shape tomorrow with design, data, and logic.
            </p>
            <p>
                </p>
          </div>
        </motion.div>
      </section>


      {/* Newsletter Section */}
      <section className="px-10 py-32 max-w-6xl mx-auto relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black/30 pointer-events-none z-20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-500/30 rounded-full blur-2xl animate-pulse delay-1000"></div>


        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h3
            className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-600 font-orbitron"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Join the Future
          </motion.h3>


          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Get exclusive tech insights, cutting-edge tutorials, and early access to the latest dragon-powered content
          </motion.p>


          <motion.div
            className="max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>


              <div className="relative flex bg-gray-900/50 backdrop-blur-md rounded-full p-2 border border-white/10">
                <input
                  type="email"
                  placeholder="Enter your email to the matrix..."
                  className="flex-1 bg-transparent text-white placeholder-gray-400 px-6 py-3 focus:outline-none text-lg"
                />
                <motion.button
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Launch 🚀
                </motion.button>
              </div>
            </div>


            <motion.div
              className="flex justify-center gap-8 mt-8 text-sm text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
            
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-500"></div>
                <span>Weekly Insights</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-1000"></div>
                <span>No Spam Ever</span>
              </div>
            </motion.div>
          </motion.div>


          <motion.div
            className="absolute top-1/4 left-1/4 text-4xl opacity-20"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            💻
          </motion.div>


          <motion.div
            className="absolute top-1/3 right-1/4 text-3xl opacity-20"
            animate={{
              y: [0, 15, 0],
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            🐉
          </motion.div>


          <motion.div
            className="absolute bottom-1/4 left-1/3 text-2xl opacity-20"
            animate={{
              y: [0, -10, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            ⚡
          </motion.div>
        </motion.div>
      </section>


     <Footer/>

      {/* Global styles for custom scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #00aaff, #004466);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #0088cc, #002233);
        }


        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #00aaff #111;
        }


        /* Hide the default cursor to show custom */
        body, main {
          cursor: none;
        }
      `}</style>
    </main>
  );
}