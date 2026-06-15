import './background.css'

export default function Background() {
    const text = [
`const exploit = async (target) => {
    const payload = Buffer.from(
        "FLAG{...}", "base64"
    );
    return await pwn(target, payload);
};`,
`$ nc chall.ctf 1337
> Welcome to the challenge
> Enter your payload:
> AAAA...AAAA
> Segmentation fault`,
`from pwn import *
p = remote("ctf.hack", 9001)
p.recvuntil(b"flag: ")
leak = u64(p.recv(8))
win = leak - 0x1f2c
p.sendline(p64(win))
print(p.recvline())`
    ]

    return <>
        <div className="bg-base" />
        <div className="dot-grid" />
        {text.map((t, i) => <div key={i} className={`code-float c${i + 1}`}>{t}</div>)}
        {[...Array(3)].map((_, i) => <div key={i} className={`orb orb-${i + 1}`} />)}
        {[...Array(3)].map((_, i) => <div key={i} className={`light-streak s${i + 1}`} />)}
        <div className="circuit-container">
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
            <div className="circuit-node" style={{ top: '197px', left: '297px' }} />
            <div className="circuit-node purple" style={{ top: '397px', left: '547px' }} />
            <div className="circuit-node green" style={{ top: '297px', right: '397px' }} />
            <div className="circuit-node" style={{ top: '597px', left: '447px' }} />
            <div className="circuit-node purple" style={{ top: '697px', right: '147px' }} />
            <div className="circuit-node green" style={{ top: '497px', right: '147px' }} />

            {[...Array(5)].map((_, i) => <div key={i} className={`data-packet p${i + 1}`} />)}
        </div>
        <div className="bottom-fade" />
        <div className="vignette" />
    </>
}
