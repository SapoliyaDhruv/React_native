import urllib.request
import re

urls = [
    # Search 1 (Std 7 Maths Ch 1)
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEhhWeONmKu2ItVsqKGI3XXB-I76Yfw2hhIk6USgpnhHUvGwfvJhXatae4YdFZH9AnItJ_m94my8sVRPWOH8wKYism0ZJEAa2OsdbWPyU07Gc7iEg_byOZtxRWo-Mizgfmo",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEILEi5RmIe9uET0ELp3CAHO0fVXPsbARkz-l15pM7FhWPxo0401aWeGOa-CrIq0ZSUipBmg-eC_K7BdtQXVLljb0E8djiPalPwHkMEEe1rfFpPZtTfF0erBTo6rufUNaw_",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFNX4hf0T2cL8kcxHjEtGMtb5Ug8zBrxhda-B5w_K4kFVid0vI9PfIeAc1f5ZzHRPl7BStkKDhra3qh71iBHSPvfR6e3A-0fDZdeK-puVb9fZRoye54O6LXcOEyhRV2twCG",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHpSxPtBcAOTxYPD2DUcQPXfL5rkt9Z6_7-Iaef84AZUD7pzZHDvl1jNZ89anFkOxMtMBV2K7mpOv-_Q1OMH-KPxUas2UwBNROd1oktDyXA_mdVgSBzkdcMNvxTv3e-Xi7g",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE9Ejij8lQYZFaCVOE9A6edGfD0ITUfs5Zrb1ja6PaW5AT9w9hQhQRr1bChXwJAI2hS1x0D9ebzBPiMixK91RUgkHfL22QfRaQEPsnQOFrUnXpYmSAA_2ozPXuobasNrJ_S",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGeE9EaFKBRiWXNWrRfrEaUqSiXTcRPx-R5ebxE3PqC-EtD0TRVKFYLFeJDZGwz6inTZJLKRNZCvnIKV066ISxp6DyaZ14LltwK663PQ5VrkTiLZM71qvFN3FVID0xU6uMP",
    # Science & Diwalipura
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEHoT1zd41UGE32muScA2P7n7qNpMk_Gta5Phj6DZOtAKlQXOKk-2Ju1HKnSSmSdfv-LSmuHDmQtAqqHyzhCUjLQEhP2jGsv6-RcHhhkiGCTirqvZDVq7FefXugPllM6oNQ",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGb27RR_R1FRRS0Ek8ogaF9F0gJxMqKQJeVzoJKuQ-7NANbFSx3c8834Z9lGX1wYBofExKilDa38PbO8vKwPnoavkjDEEglYanWP1IqToPqiqT85tCXmgBFh6de4WmxM4DE",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHTQek9jyoSqJxAEZG0GoqsgrMrBpB4YNDDP2U1pntHzytxcKBsS7Zg_ibGiEepNA9hKSvYvu-nXQDm5u7pdZ17NamggyBLUmVP7uU4S1plJTItLkk46bCJd4xKpXMVvyjq",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHFPnOx25ECqu6uYY_t-EGflDdwt1ntfT-5SWZ8iEoxQvJkyXHJbSKfKb_n4NZfqCn7-N7wDbNDia3oPnoY9sc-QI_pELw0DHH0yXwddszxTEoSPN0tvPXpGXG9VofsyFIn",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHuRk0vF_hXBkTL_cmDwtm5Z75v7I0BMYwUCsCOVYAvNnlJCyVo9c4QBLnhTwBq4qg1ty0-FlqH2lYA-iVTx-MHpJ0byggQhUNj19x03uPBv1nKJAWKuPhe7E75nGFFhkv_",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFgmVW3HGv8OrfLUtT3ObEtohb7g7M5THqylTuLVhgvQ6yRu1gRez3pYmbuVBd9czTaGgvlYN7DZ9OGVQt_oyhsElY6ypipVo5hLM9oaMGpuf5kFNkpLB_nl5bL8etBYdMY",
    # Std 8 / 10
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFxAEDUJn40K6-ePBDpi9GRVQkiVc9OIAZLTs4Gi8pY729jMFKxqa6hjh2NbwV5flxzbbhVww3CGOrK1hC_nrkNHGTbCc1CzqLe0VknyFIM2_bv1AMA0HBeUUcy3Q-89S8R",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQF2Pm-P2FrhQSCbxI1WUJTeh0VlGuyz3ZfLF_T6XQ5RtOmEMJHqONq-p9aTZrqaU-WDs74WiktSCz4xCywHshMzIrheoH3jpcy4KqWLBnZIt6awu0uOIGCBeOfdNvnwexd-",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGPaYqYbJDRR2fIDAYcJwNyEPIvwQNfNTHmUT8PS1pZcbUaie28Ic9I0_dhsdYfeyxKerZ-dJaBrzyNbQHl1K3lSpQOf6HoVmOnXgRr7yXTdejsaB4Dr7VEkRCFklLrowI2",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHDmARj1oPRQmJ6KA24dvWkBJITk8VHZjrw28qKSVl0C0eb5xP_eSPgLR2UDQsOTpdpGCVi9LhKvEUMGV05y6BMcsxzuCMmuG_0AMtak4O92RHKNIBQLhP6_WAwPmjqRIUz",
    "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHjApbr15_VLQwiCXoqheCK2BcJNwqj6Cz1TYJbR9GMlg6pnYEXHr2re_uNjRhAxy3j9LKz9ZS1sJ8_wcgneno3kyG-BkCDVHwBTCBcd-q5hUhjaVO5WnEz-9joT9cdEM_c"
]

results = []
for u in urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as r:
            final_url = r.geturl()
            m = re.search(r'v=([a-zA-Z0-9_-]{11})', final_url)
            if m:
                results.append((m.group(1), final_url))
                print(f"Found: {m.group(1)} -> {final_url}")
    except Exception as e:
        print(f"Failed for {u}: {e}")

print("Total valid video IDs found:", len(results))
with open('scripts/resolved_videos.txt', 'w', encoding='utf-8') as out:
    for vid, furl in results:
        out.write(f"{vid}\t{furl}\n")

