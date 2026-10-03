import { Rail } from "@/types/Rail.model";
import { DataSource } from "../DataSource";

// Sample stream shared by every title in the fixture data.
const SAMPLE_VIDEO_URL = "https://samplelib.com/mp4/sample-15s.mp4";

/** Square test images at a fixed size, so posters load reliably on TV hardware. */
const poster = (picsumId: number) => `https://picsum.photos/id/${picsumId}/300/300`;

export class CatalogDataSource implements DataSource<Rail[]> {
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
                    { id: 1, description: "Bob binges on bulgogi", logo: poster(1015), videoUrl: SAMPLE_VIDEO_URL, metaData: { createdAt: new Date() } },
                    { id: 2, description: "Lousie loses her lunch", logo: poster(1025), videoUrl: SAMPLE_VIDEO_URL, metaData: { createdAt: new Date(-10000) } }
                ]
            },
            {
                id: 2, title: "Here comes Halloween", titles: [
                    { id: 3, description: "Jack is back", logo: poster(1035), videoUrl: SAMPLE_VIDEO_URL, metaData: { createdAt: new Date(-20000) } },
                    { id: 4, description: "Don't watch the tape", logo: poster(1043), videoUrl: SAMPLE_VIDEO_URL, metaData: { createdAt: new Date(-30000) } }
                ]
            },
            {
                id: 3, title: "Blizzard makes a comeback", titles: [
                    { id: 5, description: "All hail the queen of blades", logo: poster(1050), videoUrl: SAMPLE_VIDEO_URL, metaData: { createdAt: new Date(-40000) } },
                    { id: 6, description: "E.T.C.", logo: poster(1062), videoUrl: SAMPLE_VIDEO_URL, metaData: { createdAt: new Date(-50000) } }
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
