export function AnimatedBackground() {
  return (
    <>
      <style>{`
        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: -50;
          overflow: hidden;
          pointer-events: none;
        }

        .bg-blob-1 {
          position: absolute;
          top: -10%;
          left: -10%;
          width: 40rem;
          height: 40rem;
          border-radius: 50%;
          background-color: rgba(6, 182, 212, 0.4);
          filter: blur(120px);
          animation: blob 8s infinite;
        }

        .bg-blob-2 {
          position: absolute;
          top: 20%;
          right: -10%;
          width: 35rem;
          height: 35rem;
          border-radius: 50%;
          background-color: rgba(139, 92, 246, 0.4);
          filter: blur(120px);
          animation: blob 8s infinite 2s;
        }

        .bg-blob-3 {
          position: absolute;
          bottom: -10%;
          left: 30%;
          width: 30rem;
          height: 30rem;
          border-radius: 50%;
          background-color: rgba(236, 72, 153, 0.3);
          filter: blur(120px);
          animation: blob 8s infinite 4s;
        }

        .dark .bg-blob-1 { background-color: rgba(8, 145, 178, 0.3); }
        .dark .bg-blob-2 { background-color: rgba(124, 58, 237, 0.3); }
        .dark .bg-blob-3 { background-color: rgba(219, 39, 119, 0.2); }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>

      <div className="animated-bg" aria-hidden="true">
        <div className="bg-blob-1" />
        <div className="bg-blob-2" />
        <div className="bg-blob-3" />
      </div>
    </>
  );
}