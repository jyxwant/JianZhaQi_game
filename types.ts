export interface Scenario {
  id: number;
  message: string;
  difficulty: number;
  red_flag_score: number;
  roast_analysis: string;
  tags?: string[];
  is_safe?: boolean; // determines if "Safe" is the correct answer
  target_user_gender?: 'male' | 'female'; // 'male' means this message is SENT TO a male (by a female)
}

export interface AnalysisResponse {
  red_flag_score: number;
  roast_analysis: string;
  tags: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  minScore: number;
  prompt_visual: string; // For AI image generation
  image: string; // 本地图片路径
}
