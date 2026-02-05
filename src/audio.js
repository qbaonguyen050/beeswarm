window.AudioManager = {
    cache: {},
    async play(id) {
        if (!this.cache[id]) {
            await this.load(id);
        }
        if (this.cache[id]) {
            const audio = new Audio(this.cache[id]);
            audio.play().catch(e => console.warn("Audio play failed:", e));
        }
    },
    async load(id) {
        return new Promise((resolve, reject) => {
            if (window[id]) {
                this.cache[id] = window[id];
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = `./audio/${id}.js`;
            script.onload = () => {
                this.cache[id] = window[id];
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
};
