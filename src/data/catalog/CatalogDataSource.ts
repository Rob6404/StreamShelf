import { Rail } from "@/types/Rail.model";
import { Title } from "@/types/Title";
import { DataSource } from "../DataSource";

class CatalogDataSource implements DataSource<Rail[]> {
    private cache: Rail[] = [];

    async get(): Promise<Rail[]> {
        if (this.cache.length > 0) {
            return this.cache;
        }

        return new Promise((resolve, reject) => {

            setTimeout(() => {

                if (this.isError()) {
                    reject(new Error("Unable to load catalog"));
                    return;
                }

                this.buildCache();
                resolve(this.cache);
            }, 250);
        });
    }

    private buildCache() {
        this.cache = [
            {
                id: 1, title: "Best of Bob's burgers",
                titles: [
                    { id: 1, description: "Bob binges on bulgogi", logo: "https://m.media-amazon.com/images/M/MV5BZTU1OGQ5MTctNjQyNy00NTRmLTg5OTktYzEyMWFlNTQyMWU4XkEyXkFqcGc@._V1_.jpg", metaData: { createdAt: new Date() } },
                    { id: 2, description: "Lousie loses her lunch", logo: "https://pyxis.nymag.com/v1/imgs/da8/6b0/ff0bb8d1008d78afe9578a47f8f7cf1129-plight-before-christmas.rhorizontal.w700.jpg", metaData: { createdAt: new Date(-10000) } }
                ]
            },
            {
                id: 2, title: "Here comes Halloween", titles: [
                    { id: 3, description: "Jack is back", logo: "https://static.wikia.nocookie.net/disney/images/0/06/Profile_-_Jack_Skellington.jpeg", metaData: { createdAt: new Date(-20000) } },
                    { id: 4, description: "Don't watch the tape", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg4u_47yevbNFLW4PPvuLc_Df0khWiIvKmnot84FPKQmpMaeB1rZUfVRU&s=10", metaData: { createdAt: new Date(-30000) } }
                ]
            },
            {
                id: 3, title: "Blizzard makes a comeback", titles: [
                    { id: 5, description: "All hail the queen of blades", logo: "https://static.wikia.nocookie.net/starcraft/images/b/b6/InfestedKerrigan_SC2_Art4.jpg", metaData: { createdAt: new Date(-40000) } },
                    { id: 6, description: "E.T.C.", logo: "https://static.wikia.nocookie.net/wowwiki/images/7/7c/Tauren_Marine1.jpg", metaData: { createdAt: new Date(-50000) } }
                ]
            }
        ];
    }

    /**
     * We want 25% of calls to fail. To do this, trying to get a random of 1-4
     * if 1-3, success. If 4, failure.
     * @returns if an error should be thrown for get()
     */
    private isError(): boolean {
        return Math.floor(Math.random() * 4) + 1 > 3;
    } 
}

export const catalogDataSource = new CatalogDataSource();
