export type Project = {
    title: string;
    description: string;
    tags: string[];
    repoUrl: string;
}

export const projects: Project[] = [
    {
        title: "blueberrydb",
        description: "blueberrydb is lightweight, redis compatible, in memory database written in golang. Written to be extremely lean and robust. Uses Append Only File(AOF) persistance.",
        tags: ["Go", "database", "redis", "key-value store"],
        repoUrl: "https://github.com/alanJames00/blueberry-db"
    },
    {
        title: "EdgeAuth",
        description: "A Time-based OTP authenticator app as an alternative to services like Google Authenticator. In EdgeAuth, the user is sole owner of his token and auth secret. Can run anywhere since it's a WebApp.",
        tags: ["Cloudflare Workers", "Encryption", "TOTP", "Javascript", "SQLite"],
        repoUrl: "https://github.com/alanJames00/edgeAuth"
    },
    {
        title: "Runx",
        description: " RunX is a Remote Code Execution Engine Written in JavaScript. Every code submission is run in isolated environments. Uses containers for security and isolation.",
        tags: ["NodeJs", "Docker", "Linux", "Shell"],
        repoUrl: "https://github.com/alanJames00/runx"
    },
    {
        title: "PairCode",
        description: "PairCode is a Realtime Collaborative Code Editor built right into a WebApp. It enables you to code collaboratively in real-time with your team members or interviewer with zero setup or config.",
        tags: ["ReactJs", "NextJs", "Websockets", "ExpressJs", "Realtime Systems"],
        repoUrl: "https://github.com/alanJames00/pair-code"
    },
    {
        title: "getignore",
        description: "Getignore is a simple cli tool to generate gitignore files for several programming languages and platforms. Constantly updated list and content with industry standards. Supports appending and overwrite modes on gitignore files",
        tags: ["Golang", "gitignore", "cli"],
        repoUrl: "https://github.com/alanJames00/getignore"
    },
    {
        title: "AutoPassWireless",
        description: "AutoPassWireless is a simple chrome extension to automate wifi logins in LPU University captive portals. This was initially developed as a personal project I had written for automating wifi logins at my University. Turned out to be pretty useful for fellow students",
        tags: ["wifi", "captive-portal", "automate"],
        repoUrl: "https://github.com/alanJames00/AutoPassWireless"
    }
]