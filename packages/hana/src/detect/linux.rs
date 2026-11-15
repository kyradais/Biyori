use super::shared::{classify_player, extract_file_path, file_path_from_cmd, pick_hit, query_unix_mpv};
use crate::types::{NowPlaying, NowPlayingInput};
use std::process::Command;
use sysinfo::{ProcessesToUpdate, System};

fn get_linux_window_title(pid: u32) -> Option<String> {
	let output = Command::new("xdotool")
		.args(["search", "--pid", &pid.to_string(), "--name", ".*"])
		.output()
		.ok()?;
	let window_ids = String::from_utf8_lossy(&output.stdout);
	for wid in window_ids.lines() {
		let wid = wid.trim();
		if wid.is_empty() {
			continue;
		}
		let title_output = Command::new("xdotool")
			.args(["getwindowname", wid])
			.output()
			.ok()?;
		let title = String::from_utf8_lossy(&title_output.stdout).trim().to_string();
		if !title.is_empty() {
			return Some(title);
		}
	}
	None
}

pub fn now_playing(input: NowPlayingInput) -> Option<NowPlaying> {
	let mut sys = System::new();
	sys.refresh_processes(ProcessesToUpdate::All, true);
	let mut hits: Vec<NowPlaying> = Vec::new();
	for (pid, proc) in sys.processes() {
		let name = proc.name().to_string_lossy().to_string();
		let Some((key, is_browser)) = classify_player(&name, &input) else {
			continue;
		};
		if is_browser {
			continue;
		}
		let pid_u32 = pid.as_u32();
		let ipc = if key.contains("mpv") {
			query_unix_mpv(pid_u32)
		} else {
			None
		};
		let mut file_path = ipc.or_else(|| file_path_from_cmd(proc.cmd()));
		let title = get_linux_window_title(pid_u32);
		if file_path.is_none() {
			if let Some(ref t) = title {
				let cleaned = crate::parse::strip_player_suffix(t);
				file_path = extract_file_path(t).or_else(|| Some(cleaned.to_string()));
			}
		}
		hits.push(NowPlaying {
			player: key,
			window_id: pid_u32.to_string(),
			title,
			file_path,
			url: None,
			foreground: false,
			browser: Some(false),
		});
	}
	pick_hit(hits, input.preferred_window_id.as_deref())
}

#[cfg(test)]
mod tests {
	use super::super::shared::unix_mpv_paths;

	#[test]
	fn linux_mpv_paths_include_runtime_and_tmp() {
		let paths = unix_mpv_paths(7);
		assert!(paths.iter().any(|path| path.ends_with("mpv-7") || path.ends_with("mpv-socket")));
	}
}
