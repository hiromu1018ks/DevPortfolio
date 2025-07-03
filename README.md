# Morphing Geometric Canvas - Interactive 3D Portfolio

An interactive 3D portfolio website featuring geometric transformations and minimalist design, built with Next.js and Three.js.

## 🎯 Concept

"The Morphing Geometric Canvas" - A living geometric art piece on a white canvas that expresses engineering logic and creativity. Visitors experience a sophisticated space that is both static and dynamic, providing an interactive work that changes with user interactions.

## ✨ Features

- **Interactive 3D Scene**: Mouse-responsive geometric shapes using Three.js
- **Minimalist Design**: Clean white and black color scheme with blue accents
- **Geometric Purity**: Basic geometric forms (cubes, particles, lines)
- **Responsive Layout**: Mobile-friendly design
- **Modern Tech Stack**: Next.js, TypeScript, styled-components

## 🛠 Technology Stack

- **Framework**: Next.js 15.3.4 (TypeScript)
- **3D Graphics**: @react-three/fiber, @react-three/drei, Three.js
- **Styling**: styled-components, Tailwind CSS
- **Development**: Docker support
- **Font**: Inter (Google Fonts)

## 🚀 Getting Started

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Development

1. **Using Docker Compose**:
   ```bash
   docker-compose up app-dev
   ```

2. **Access the application**:
   Navigate to [http://localhost:3001](http://localhost:3001)

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
├── components/
│   ├── 3d/                # Three.js components
│   ├── layout/            # Layout components
│   └── ui/                # UI components
├── constants/             # Color palette and constants
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## 🎨 Design Principles

- **Strict Minimalism**: Elimination of decorative elements
- **Geometric Purity**: Basic geometric shapes only
- **Limited Color Palette**: White, black, and electric blue
- **Consistent Interactivity**: Responsive to all user actions
- **Construction & Deconstruction**: Animated assembly/disassembly

## 🎮 Interactions

- **Mouse Movement**: Geometric shapes respond to cursor position
- **Hover Effects**: Shape transformations and wireframe changes
- **Smooth Animations**: Gentle easing with subtle inertia
- **Particle System**: Ambient particle animations

## 📦 Build & Deploy

The project includes Docker configuration for easy deployment:

```bash
# Build Docker image
docker build -t portfolio .

# Run container
docker run -p 3000:3000 portfolio
```

## 🤝 Contributing

This is a portfolio project. For questions or suggestions, please open an issue.

## 📄 License

This project is for portfolio demonstration purposes.
