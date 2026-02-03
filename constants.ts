
import { Character, ArchiveLog } from './types';

export const MOCK_CHARACTERS: Character[] = [
  {
    id: 'char_1',
    name: '凯伦·逐星',
    title: 'High Void Archmage / The Silencer',
    tags: ['Mysticism', 'INTJ', 'Void Master', 'Stoic'],
    attributes: {
      height: '185cm',
      age: '24',
      alignment: '秩序中立',
      gender: '男性'
    },
    introduction: '凯伦出生在被遗忘的北境荒原，自幼便展现出对虚空能量的惊人亲和力。作为“沉默之环”最年轻的高阶法师，他不仅掌握着操控空间裂隙的古老咒语，更背负着守护边境禁地的沉重宿命。',
    quote: '每一个词汇的震动，都可能在虚空深处引发回响。',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKToXHKrbDCWWlypof_gipah4fW9w-otZE-HsZ82t0sVRC-jlKh7eNFsGL-FYx8PXa6rZCP0atziTgjPYoYwf38wg0nntFCT-F-_j5HBlfbapUIxelZj5vtY7aHo77QRMx6FmFN3ks20cfCwAD7jO7W5Q_6kkgBAE2pIiS3xmgqRCUc_nnS7WAOI0SVMef35VsEV6zEEiHZM0CE1uLHuAcDSA8guWsy3BVl6zySrhWVUHu8MasPW8me6ytCLpUp-3IgOEH0-dpZFcn'
  },
  {
    id: 'char_2',
    name: '艾莉亚·索恩',
    title: 'Nature Healer / Forest Whisperer',
    tags: ['Empathy', 'INFJ', 'Botanist', 'Gentle'],
    attributes: {
      height: '168cm',
      age: '21',
      alignment: '中立善良',
      gender: '女性'
    },
    introduction: '生长于永恒森林的深处，艾莉亚拥有与植物直接对话的罕见天赋。她的指尖流淌着治愈生命的碧绿光芒，在这个充满纷争的世界中寻求宁静。',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFCr46dqsc5JiT-0obkoyqUW8ZbsgO6g6faWolMu5WmX-2HirVq7lFdjz60FQ_RNYWie92SPtWssQ-zZlKhDqvmZZ0RB3j5Uyvn8x7wd0lhWXkyUHTpxDzDTrOam2bT2xYZPAq5_3snhtMiQD5HmbzNmR704u88-uNrFTLHGQ8msJRCnwNfTcXJDpykUcGGPRt7S28p4_YXcULZVtYuf9-p2W_kwjko7PRzgsecVnOe0MO5XcrYyuqAv6Y09BHkNX4NkUG0Mtjn5Z8'
  }
];

export const MOCK_LOGS: ArchiveLog[] = [
  {
    id: 'log_1',
    title: '绯红之夜：虚空再临',
    status: 'Ongoing',
    timestamp: '2023.11.24',
    wordCount: '2,480',
    summary: '极北荒原的边界线正在崩塌，虚空的裂痕中传来了不属于这个世界的声音。',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG5eZ7AvluZNWLNad1jQDMnc-yakTMF0tUReQ5DgA3Q9EtugVKezUFuYfH-P15rt6uZ_Xemb83QyrLTLR_Q3BG-qX4arrKMnWq30yM6XuueouqnzF1p0c-NF0Ox7K7n3-F-l_312NVXVx4H76AQkJrOjoYU-fvxoEA6ChC2oESuQ3yRaYPqdZh1DTBTvJn0psINLE_AXBKNKlRj7Z41g70WuxSOPSUPzEaX7yp56TR_yZvPBy0qiFij2s3Q6CUlh2HNZyUzIyPrzR-',
    participants: ['char_1']
  }
];
