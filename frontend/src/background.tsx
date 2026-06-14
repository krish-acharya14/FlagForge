/// <reference types="react" />
/// <reference types="react/jsx-runtime" />
import * as React from "react";
import "./background.css";

const Background: React.FC = () => {
  return (
    <>
      {/* LAYER 1: Rich base with depth */}
      <div className="bg-base" />

      {/* LAYER 2: Dot grid */}
      <div className="dot-grid" />

      {/* LAYER 3: Floating code snippets */}
      <div className="code-float c1">{`const exploit = async (target) => {
  const payload = Buffer.from(
    "FLAG{...}", "base64"
  );
  return await pwn(target, payload);
};`}</div>

      <div className="code-float c2">{`$ nc chall.ctf 1337
> Welcome to the challenge
> Enter your payload:
> AAAA...AAAA
> Segmentation fault`}</div>

      <div className="code-float c3">{`from pwn import *

p = remote("ctf.hack", 9001)
p.recvuntil(b"flag: ")
leak = u64(p.recv(8))
win = leak - 0x1f2c
p.sendline(p64(win))
print(p.recvline())`}</div>

      {/* LAYER 4: Ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* LAYER 5: Light streaks */}
      <div className="light-streak s1" />
      <div className="light-streak s2" />
      <div className="light-streak s3" />

      {/* LAYERS 6–7: Circuit board traces, nodes, data packets */}
      <div className="circuit-container">

        {/* Traces */}
        <div className="circuit-line h" style={{ top: '200px', left: '100px', width: '200px' }} />
        <div className="circuit-line v" style={{ top: '200px', left: '300px', height: '200px' }} />
        <div className="circuit-line h" style={{ top: '400px', left: '300px', width: '250px' }} />
        <div className="circuit-line v" style={{ top: '400px', left: '550px', height: '150px' }} />

        <div className="circuit-line h" style={{ top: '300px', right: '200px', width: '200px' }} />
        <div className="circuit-line v" style={{ top: '300px', right: '400px', height: '200px' }} />
        <div className="circuit-line h" style={{ top: '500px', right: '400px', width: '180px' }} />

        <div className="circuit-line h" style={{ top: '600px', left: '150px', width: '300px' }} />
        <div className="circuit-line v" style={{ top: '600px', left: '450px', height: '200px' }} />

        <div className="circuit-line h" style={{ top: '700px', right: '150px', width: '250px' }} />
        <div className="circuit-line v" style={{ top: '500px', right: '150px', height: '200px' }} />

        {/* Nodes */}
        <div className="circuit-node"        style={{ top: '197px', left:  '297px' }} />
        <div className="circuit-node purple"  style={{ top: '397px', left:  '547px' }} />
        <div className="circuit-node green"   style={{ top: '297px', right: '397px' }} />
        <div className="circuit-node"         style={{ top: '597px', left:  '447px' }} />
        <div className="circuit-node purple"  style={{ top: '697px', right: '147px' }} />
        <div className="circuit-node green"   style={{ top: '497px', right: '147px' }} />

        {/* Data packets */}
        <div className="data-packet p1" />
        <div className="data-packet p2" />
        <div className="data-packet p3" />
        <div className="data-packet p4" />
        <div className="data-packet p5" />
      </div>

      {/* LAYER 8: Bottom fade */}
      <div className="bottom-fade" />

      {/* LAYER 9: Soft vignette */}
      <div className="vignette" />
    </>
  );
};

export default Background;